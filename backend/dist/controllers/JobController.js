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
exports.getASingleJob = exports.deleteJob = exports.getMyJobs = exports.getAllJobs = exports.postJob = void 0;
const catchAsyncError_1 = require("../Middlewares/catchAsyncError");
const error_1 = __importDefault(require("../Middlewares/error"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.postJob = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { title, jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary, hiringMultipleCandidates, personalWebsite, jobNiche, } = req.body;
    // Validate required fields
    if (!title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !responsibilities ||
        !qualifications ||
        !salary ||
        !jobNiche) {
        return next(new error_1.default("Please provide full job details.", 400));
    }
    // Validate user authentication
    const postedById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!postedById) {
        return next(new error_1.default("User is not authenticated.", 401));
    }
    // Convert personalWebsite to JSON
    const personalWebsiteJson = personalWebsite
        ? {
            title: personalWebsite.personalWebsiteTitle,
            url: personalWebsite.personalWebsiteUrl,
        }
        : client_1.Prisma.JsonNull;
    try {
        // Create the job
        const job = yield prisma.job.create({
            data: {
                title,
                jobType: jobType, // Ensure it matches the enum
                location,
                companyName,
                introduction,
                responsibilities,
                qualifications,
                offers,
                salary,
                hiringMultipleCandidates: hiringMultipleCandidates, // Ensure it matches the enum
                personalWebsite: personalWebsiteJson,
                jobNiche,
                postedById,
            },
        });
        const employerInfo = yield prisma.employerInfo.create({
            data: {
                role: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) || "Employer",
                EmployeruserId: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || -1,
                jobPostedId: Number(job.id)
            }
        });
        res.status(201).json({
            success: true,
            message: "Job posted successfully.",
            job,
        });
    }
    catch (error) {
        return next(new error_1.default("Failed to post job: " + error, 500));
    }
}));
exports.getAllJobs = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { city, niche, searchKeyword } = req.query;
    // Build dynamic filtering conditions
    const filters = {};
    if (city) {
        filters.location = {
            contains: city, // Matches partial city name
            mode: "insensitive", // Case-insensitive match
        };
    }
    if (niche) {
        filters.jobNiche = {
            contains: niche,
            mode: "insensitive",
        };
    }
    if (searchKeyword) {
        filters.OR = [
            { title: { contains: searchKeyword, mode: "insensitive" } },
            { companyName: { contains: searchKeyword, mode: "insensitive" } },
            { introduction: { contains: searchKeyword, mode: "insensitive" } },
        ];
    }
    try {
        const jobs = yield prisma.job.findMany({
            where: filters,
        });
        return res.status(200).json({
            success: true,
            jobs,
            count: jobs.length,
        });
    }
    catch (error) {
        return next(new Error("Failed to fetch jobs: " + error));
    }
}));
exports.getMyJobs = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const myJobs = yield prisma.job.findMany({
        where: {
            postedById: Number((_d = req.user) === null || _d === void 0 ? void 0 : _d.id)
        }
    });
    return res.status(200).json({
        success: true,
        myJobs,
    });
}));
exports.deleteJob = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const job = yield prisma.job.findFirst({
        where: {
            id: Number(id)
        }
    });
    if (!job) {
        return next(new error_1.default("no job found", 404));
    }
    yield prisma.application.deleteMany({
        where: {
            jobInfoId: {
                in: yield prisma.jobInfo.findMany({
                    where: { jobId: Number(id) },
                    select: { id: true }
                }).then((results) => results.map((jobInfo) => jobInfo.id))
            }
        }
    });
    // Delete related records in JobInfo table
    yield prisma.jobInfo.deleteMany({
        where: {
            jobId: Number(id)
        }
    });
    // Delete related employer info
    yield prisma.employerInfo.deleteMany({
        where: {
            jobPostedId: Number(id)
        }
    });
    // Delete related job seeker info
    yield prisma.jobSeekerInfo.deleteMany({
        where: {
            forWhichJobId: Number(id)
        }
    });
    // Finally, delete the job record
    yield prisma.job.delete({
        where: {
            id: Number(id)
        }
    });
    return res.status(200).json({
        success: true,
        message: "Job and related applications have been deleted"
    });
}));
exports.getASingleJob = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const job = yield prisma.job.findFirst({
        where: {
            id: Number(id)
        }
    });
    if (!job) {
        return next(new error_1.default("Job not found.", 404));
    }
    return res.status(200).json({
        success: true,
        job,
    });
}));
