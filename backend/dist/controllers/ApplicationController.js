"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.jobSeekerGetAllApplication = exports.employerGetAllApplication = exports.PostApplication = void 0;
const catchAsyncError_1 = require("../Middlewares/catchAsyncError");
const error_1 = __importDefault(require("../Middlewares/error"));
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("cloudinary"));
const prisma = new client_1.PrismaClient();
exports.PostApplication = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const job_id = req.params.job_id;
    const { name, email, phone, address, coverletter, role } = req.body;
    if (!name || !email || !phone || !address || !coverletter) {
        next(new error_1.default("please provide full information", 400));
    }
    const JobDetails = yield prisma.job.findFirst({
        where: {
            id: Number(job_id)
        }
    });
    if (!JobDetails) {
        return next(new error_1.default("Job Not Found", 404));
    }
    const JobSeekerInfo = {
        JobSeekeruserId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || -1,
        forWhichJobId: Number(job_id) || -1,
        name,
        email,
        phone,
        address,
        coverletter,
        role
    };
    const isAlreadyApplied = yield prisma.jobSeekerInfo.findFirst({
        where: {
            JobSeekeruserId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            forWhichJobId: Number(job_id)
        }
    });
    if (isAlreadyApplied) {
        return next(new error_1.default("already applied to this job ", 400));
    }
    if (req.files) {
        const { resume } = req.files;
        try {
            let cloudinaryResponse;
            if (!Array.isArray(resume)) {
                cloudinaryResponse = yield cloudinary_1.default.v2.uploader.upload(resume.tempFilePath, {
                    folder: "Job_Seekers_Resume",
                });
                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    return next(new error_1.default("Failed to upload resume to cloudinary.", 500));
                }
            }
            JobSeekerInfo.resume = {
                public_id: (cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.public_id) || "",
                url: (cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url) || "",
            };
        }
        catch (error) {
            return next(new error_1.default("Failed to upload resume", 500));
        }
    }
    const postedBy = yield prisma.user.findFirst({
        where: {
            id: JobDetails.postedById
        }
    });
    if (!postedBy) {
        return next(new error_1.default("who posted the job? ", 400));
    }
    const EmployerInfo = {
        EmployeruserId: postedBy.id,
        role
    };
    const jobSeekerInformation = yield prisma.jobSeekerInfo.create({
        data: Object.assign({}, JobSeekerInfo)
    });
    const EmployerInformation = yield prisma.employerInfo.create({
        data: Object.assign({}, EmployerInfo)
    });
    const jobInformation = yield prisma.jobInfo.create({
        data: {
            jobId: Number(job_id),
            jobTitle: JobDetails.title
        }
    });
    const application = yield prisma.application.create({
        data: {
            jobSeekerInfoId: jobSeekerInformation.id,
            employerInfoId: EmployerInformation.id,
            jobInfoId: jobInformation.id
        }
    });
    if (!application) {
        return next(new error_1.default("failed to post job", 400));
    }
    return res.status(201).json({
        success: true,
        message: "application successfull sent for this job ",
        jobSeekerInformation,
        EmployerInformation,
        jobInformation,
        application
    });
}));
exports.employerGetAllApplication = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const jobPosedByEmployer = yield prisma.employerInfo.findMany({
        where: {
            EmployeruserId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id
        }
    });
    const jobPosedByEmployerArray = jobPosedByEmployer
        .map(app => app.jobPostedId)
        .filter((id) => id !== null);
    // If no jobs are found, return early
    if (jobPosedByEmployerArray.length === 0) {
        return res.status(200).json({
            message: "No application for any job",
        });
    }
    const application = yield prisma.jobSeekerInfo.findMany({
        where: {
            forWhichJobId: {
                in: jobPosedByEmployerArray
            }
        }
    });
    let jobinfo;
    for (const app of application) {
        jobinfo = yield prisma.job.findFirst({
            where: {
                id: app.forWhichJobId, // Access the `forWhichJobId` of each object
            },
        });
        // Process `jobinfo` as needed
    }
    return res.status(200).json({
        sucess: true,
        message: "successfully get employer applications ",
        applications: application,
        jobPosedByEmployer: jobPosedByEmployer,
        jobInfo: jobinfo
    });
}));
exports.jobSeekerGetAllApplication = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    const applicationApplied = yield prisma.jobSeekerInfo.findMany({
        where: {
            JobSeekeruserId: id
        }
    });
    const jobInfoArray = applicationApplied.map(app => app.forWhichJobId);
    const jobs = yield prisma.job.findMany({
        where: {
            id: {
                in: jobInfoArray
            }
        }
    });
    let finalJobarray = [];
    if (jobs) {
        finalJobarray = jobs.map(job => job.id);
    }
    const finalJobs = yield prisma.job.findMany({
        where: {
            id: {
                in: finalJobarray
            }
        }
    });
    return res.status(200).json({
        success: true,
        message: "successfully get all your applications",
        jobs: finalJobs,
        applicationApplied: applicationApplied
    });
}));
exports.deleteApplication = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    const application = yield prisma.jobSeekerInfo.findFirst({
        where: {
            id: Number(id)
        }
    });
    if (!application) {
        return next(new error_1.default("application in jobSeeker database not found", 404));
    }
    yield prisma.application.deleteMany({
        where: {
            jobSeekerInfoId: Number(id)
        }
    });
    // Delete the jobSeekerInfo record
    yield prisma.jobSeekerInfo.delete({
        where: {
            id: Number(id)
        }
    });
    return res.status(200).json({
        success: true,
        message: "application deleted successfully"
    });
}));
