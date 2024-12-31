
import { Response, Request, NextFunction } from "express";
import { catchAsyncError } from "../Middlewares/catchAsyncError";
import ErrorHandler from "../Middlewares/error";
import { JobType, Prisma, PrismaClient, YesNo } from "@prisma/client";

const prisma = new PrismaClient();

export const postJob = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsite,
        jobNiche,
    } = req.body;

    // Validate required fields
    if (
        !title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !responsibilities ||
        !qualifications ||
        !salary ||
        !jobNiche
    ) {
        return next(new ErrorHandler("Please provide full job details.", 400));
    }

    // Validate user authentication
    const postedById = req.user?.id;
    if (!postedById) {
        return next(new ErrorHandler("User is not authenticated.", 401));
    }

    // Convert personalWebsite to JSON
    const personalWebsiteJson = personalWebsite
        ? {
            title: personalWebsite.personalWebsiteTitle,
            url: personalWebsite.personalWebsiteUrl,
        }
        : Prisma.JsonNull;

    try {
        // Create the job
        const job = await prisma.job.create({
            data: {
                title,
                jobType: jobType as JobType, // Ensure it matches the enum
                location,
                companyName,
                introduction,
                responsibilities,
                qualifications,
                offers,
                salary,
                hiringMultipleCandidates: hiringMultipleCandidates as YesNo, // Ensure it matches the enum
                personalWebsite: personalWebsiteJson,
                jobNiche,
                postedById,
            },
        });

        const employerInfo = await prisma.employerInfo.create({
            data: {
                role: req.user?.role || "Employer",
                EmployeruserId: req.user?.id || -1,
                jobPostedId: Number(job.id)
            }
        })

        res.status(201).json({
            success: true,
            message: "Job posted successfully.",
            job,
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to post job: " + error, 500));
    }
});



export const getAllJobs = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const { city, niche, searchKeyword } = req.query;

    // Build dynamic filtering conditions
    const filters: any = {};
    if (city) {
        filters.location = {
            contains: city as string, // Matches partial city name
            mode: "insensitive", // Case-insensitive match
        };
    }
    if (niche) {
        filters.jobNiche = {
            contains: niche as string,
            mode: "insensitive",
        };
    }
    if (searchKeyword) {
        filters.OR = [
            { title: { contains: searchKeyword as string, mode: "insensitive" } },
            { companyName: { contains: searchKeyword as string, mode: "insensitive" } },
            { introduction: { contains: searchKeyword as string, mode: "insensitive" } },
        ];
    }

    try {
        const jobs = await prisma.job.findMany({
            where: filters,
        });

        return res.status(200).json({
            success: true,
            jobs,
            count: jobs.length,
        });
    } catch (error) {
        return next(new Error("Failed to fetch jobs: " + error));
    }
});

export const getMyJobs = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


    const myJobs = await prisma.job.findMany({
        where: {
            postedById: Number(req.user?.id)
        }
    })

    return res.status(200).json({
        success: true,
        myJobs,
    });
});


export const deleteJob = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


    const { id } = req.params;

    const job = await prisma.job.findFirst({
        where: {
            id: Number(id)
        }
    })


    if (!job) {
        return next(new ErrorHandler("no job found", 404));
    }

    
    await prisma.application.deleteMany({
        where: {
            jobInfoId: {
                in: await prisma.jobInfo.findMany({
                    where: { jobId: Number(id) },
                    select: { id: true }
                }).then((results) => results.map((jobInfo) => jobInfo.id))
            }
        }
    });


    // Delete related records in JobInfo table
    await prisma.jobInfo.deleteMany({
        where: {
            jobId: Number(id)
        }
    });

    // Delete related employer info
    await prisma.employerInfo.deleteMany({
        where: {
            jobPostedId: Number(id)
        }
    });

    // Delete related job seeker info
    await prisma.jobSeekerInfo.deleteMany({
        where: {
            forWhichJobId: Number(id)
        }
    });

    // Finally, delete the job record
    await prisma.job.delete({
        where: {
            id: Number(id)
        }
    });

    return res.status(200).json({
        success: true,
        message: "Job and related applications have been deleted"
    });


});

export const getASingleJob = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const job = await prisma.job.findFirst({
        where: {
            id: Number(id)
        }
    })


    if (!job) {
        return next(new ErrorHandler("Job not found.", 404));
    }
    return res.status(200).json({
        success: true,
        job,
    });
});



