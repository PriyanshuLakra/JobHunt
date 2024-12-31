import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../Middlewares/catchAsyncError";
import ErrorHandler from "../Middlewares/error";
import { JobType, Prisma, PrismaClient, YesNo } from "@prisma/client";
import cloudinary from "cloudinary"
import { JsonObject } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface Resume {
    public_id: string
    url: string
}
interface JobSeekerInfoInterface {
    JobSeekeruserId: number
    forWhichJobId: number
    name: string
    email: string
    phone: string
    address: string
    coverletter: string
    role: string
    resume?: JsonObject
}

interface EmployerInfoInterface {
    EmployeruserId: any,
    role: string
}

export const PostApplication = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


    const job_id = req.params.job_id

    const { name, email, phone, address, coverletter, role } = req.body

    if (!name || !email || !phone || !address || !coverletter) {
        next(new ErrorHandler("please provide full information", 400));
    }

    const JobDetails = await prisma.job.findFirst({
        where: {
            id: Number(job_id)
        }
    })


    if (!JobDetails) {
        return next(new ErrorHandler("Job Not Found", 404));
    }


    const JobSeekerInfo: JobSeekerInfoInterface = {
        JobSeekeruserId: req.user?.id || -1,
        forWhichJobId: Number(job_id) || -1,
        name,
        email,
        phone,
        address,
        coverletter,
        role
    }


    const isAlreadyApplied = await prisma.jobSeekerInfo.findFirst({
        where: {
            JobSeekeruserId: req.user?.id,
            forWhichJobId: Number(job_id)
        }
    })

    if (isAlreadyApplied) {
        return next(new ErrorHandler("already applied to this job ", 400));
    }

    if (req.files) {
        const { resume } = req.files
        try {
            let cloudinaryResponse;
            if (!Array.isArray(resume)) {
                cloudinaryResponse = await cloudinary.v2.uploader.upload(
                    resume.tempFilePath,
                    {
                        folder: "Job_Seekers_Resume",
                    }
                );
                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    return next(
                        new ErrorHandler("Failed to upload resume to cloudinary.", 500)
                    );
                }
            }
            JobSeekerInfo.resume = {
                public_id: cloudinaryResponse?.public_id || "",
                url: cloudinaryResponse?.secure_url || "",
            };
        } catch (error) {
            return next(new ErrorHandler("Failed to upload resume", 500));
        }
    }

    const postedBy = await prisma.user.findFirst({
        where: {
            id: JobDetails.postedById
        }
    })


    if (!postedBy) {
        return next(new ErrorHandler("who posted the job? ", 400));
    }

    const EmployerInfo: EmployerInfoInterface = {
        EmployeruserId: postedBy.id,
        role
    }

    const jobSeekerInformation = await prisma.jobSeekerInfo.create({
        data: {
            ...JobSeekerInfo
        }
    })

    const EmployerInformation = await prisma.employerInfo.create({
        data: {
            ...EmployerInfo
        }
    })


    const jobInformation = await prisma.jobInfo.create({
        data: {
            jobId: Number(job_id),
            jobTitle: JobDetails.title
        }
    })

    const application = await prisma.application.create({
        data: {
            jobSeekerInfoId: jobSeekerInformation.id,
            employerInfoId: EmployerInformation.id,
            jobInfoId: jobInformation.id
        }
    })

    if (!application) {
        return next(new ErrorHandler("failed to post job", 400));
    }

    return res.status(201).json({
        success: true,
        message: "application successfull sent for this job ",
        jobSeekerInformation,
        EmployerInformation,
        jobInformation,
        application
    })

})


export const employerGetAllApplication = catchAsyncError(

    async (req: Request, res: Response, next: NextFunction) => {

        const jobPosedByEmployer = await prisma.employerInfo.findMany({
            where: {
                EmployeruserId: req.user?.id
            }
        })

        

        const jobPosedByEmployerArray = jobPosedByEmployer
            .map(app => app.jobPostedId)
            .filter((id): id is number => id !== null);


        // If no jobs are found, return early
        if (jobPosedByEmployerArray.length === 0) {
            return res.status(200).json({
                message: "No application for any job",
            });
        }


        const application = await prisma.jobSeekerInfo.findMany({
            where: {
                forWhichJobId: {
                    in: jobPosedByEmployerArray
                }
            }
        })

        

        let jobinfo;
        for (const app of application) {
            jobinfo = await prisma.job.findFirst({
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
        })
    }
);


export const jobSeekerGetAllApplication = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {

        const id = req.user?.id

        const applicationApplied = await prisma.jobSeekerInfo.findMany({
            where: {
                JobSeekeruserId: id
            }
        })

        const jobInfoArray = applicationApplied.map(app => app.forWhichJobId)

        const jobs = await prisma.job.findMany({
            where: {
                id: {
                    in: jobInfoArray
                }
            }
        })

        let finalJobarray: number[] = [];

        if (jobs) {
            finalJobarray = jobs.map(job => job.id);
        }

        const finalJobs = await prisma.job.findMany({
            where: {
                id: {
                    in: finalJobarray
                }
            }
        })
        

        return res.status(200).json({
            success: true,
            message: "successfully get all your applications",
            jobs: finalJobs,
            applicationApplied: applicationApplied
        })
    }
);

export const deleteApplication = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id
    console.log(id);
    const application = await prisma.jobSeekerInfo.findFirst({
        where:{
            id:Number(id)
        }
    })

    if(!application){
        return next(new ErrorHandler("application in jobSeeker database not found" , 404));
    }


    await prisma.application.deleteMany({
        where: {
            jobSeekerInfoId: Number(id)
        }
    });

    // Delete the jobSeekerInfo record
    await prisma.jobSeekerInfo.delete({
        where: {
            id: Number(id)
        }
    });

    return res.status(200).json({
        success:true,
        message:"application deleted successfully"
    })

    
});


