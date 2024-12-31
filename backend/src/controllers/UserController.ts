import { Response, Request, NextFunction } from "express";
import { catchAsyncError } from "../Middlewares/catchAsyncError";
import ErrorHandler from "../Middlewares/error";
import cloudinary from "cloudinary"
import { PrismaClient, User } from '@prisma/client'
import { SendToken } from "../utils/JWToken";
const prisma = new PrismaClient()

interface UserData {
    name: any;
    email: any;
    phone: any;
    address: any;
    password: any;
    role: any;
    niches: {
        Firstniche: any;
        Secondniche: any;
        Thirdniche: any;
    };
    coverletter: any;
    resume?: {
        public_id: string;
        url: string;
    };
}


export const register = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {


        const { name, email, phone, password, address, Firstniche, Secondniche, Thirdniche, coverletter, role } = req.body;

        if (!name || !email || !phone || !password || !address || !role) {
            return next(new ErrorHandler("please provide all information ", 400));
        }

        if (role === "JobSeeker" && (!Firstniche || !Secondniche || !Thirdniche)) {
            return next(new ErrorHandler("provide all three niches", 400));
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return next(new ErrorHandler("email already exists", 400));
        }

        const userData: UserData = {
            name,
            email,
            phone,
            address,
            password,
            role,
            niches: {
                Firstniche,
                Secondniche,
                Thirdniche,
            },
            coverletter,

        };


        if (req.files) {
            const resume = req.files["resume"];
            if (resume) {
                try {
                    let cloudinaryResponse
                    if (!Array.isArray(resume)) {

                        cloudinaryResponse = await cloudinary.v2.uploader.upload(
                            resume.tempFilePath,
                            { folder: "JOB_Seeker_Resume" }
                        )

                        if (!cloudinaryResponse || cloudinaryResponse.error) {
                            return next(new ErrorHandler("failed to upload resume", 400));
                        }
                    }
                    else {
                        return next(new ErrorHandler("multiple files attached", 400));
                    }

                    if (cloudinaryResponse) {
                        userData.resume = {
                            public_id: cloudinaryResponse.public_id,
                            url: cloudinaryResponse.secure_url,
                        }
                    }
                }
                catch (e: any) {
                    return next(new ErrorHandler(e, 500));
                }
            }
        }

        const user = await prisma.user.create({
            data: {
                ...userData
            }
        })
        SendToken(user, 201, res, "User Registered")
    }
    catch (e) {
        next(e);
    }
})


export const login = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


    const { role, email, password } = req.body

    if (!role || !email || !password) {
        return next(new ErrorHandler("please provide role , email and password", 400));
    }


    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })


    if (!user) {
        return next(new ErrorHandler("user with this email does not exists", 400));
    }


    if (password !== user.password || email !== user.email || role !== user.role) {
        return next(new ErrorHandler("wrong Password for this role", 400));
    }



    SendToken(user, 200, res, "User logied in Successifully");
})



export const logout = catchAsyncError((req: Request, res: Response, next: NextFunction) => {

    res.status(200).cookie("token", "").json({
        success: true,
        message: "logged out successfully"
    })
})

export const getUser = catchAsyncError((req: Request, res: Response, next: NextFunction) => {

    const user = req.user
    res.status(201).json({
        success: true,
        user
    })

})

interface newUserDataInt {
    name?: any;
    email?: any;
    phone?: any;
    address?: any;
    password?: any;
    niches: {
        Firstniche?: any;
        Secondniche?: any;
        Thirdniche?: any;
    };
    coverletter?: any;
    resume?: {
        public_id: string;
        url: string;
    };
}


export const updateProfile = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


    const newUserData: newUserDataInt = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        coverletter: req.body.coverletter,
        niches: {
            Firstniche: req.body.Firstniche,
            Secondniche: req.body.Secondniche,
            Thirdniche: req.body.Thirdniche,
        },
    }
   
    const { Firstniche, Secondniche, Thirdniche } = newUserData.niches

    if (req.user?.role === "JobSeeker" && ((!Firstniche) || !Secondniche || !Thirdniche)) {
        next(new ErrorHandler("please provide all three niches", 400));
    }

    if (req.files) {
        const resume = req.files["resume"];
        if (resume && req.user?.resume) {
            try {
                
                const currentResumeId = (req.user.resume as any).public_id;
                if (currentResumeId) {
                    await cloudinary.v2.uploader.destroy(currentResumeId);
                }
                
                if(!Array.isArray(resume)){
                    const newResume = await cloudinary.v2.uploader.upload(
                        resume.tempFilePath,
                        { folder: "JOB_Seeker_Resume" }
                    )
                    newUserData.resume = {
                        public_id: newResume.public_id,
                        url: newResume.secure_url,
                    };
                }
            }
            catch (e: any) {
                return next(new ErrorHandler(e, 500));
            }
        }
        else if(resume && !req.user?.resume){
            try {
                let cloudinaryResponse
                if (!Array.isArray(resume)) {

                    cloudinaryResponse = await cloudinary.v2.uploader.upload(
                        resume.tempFilePath,
                        { folder: "JOB_Seeker_Resume" }
                    )

                    if (!cloudinaryResponse || cloudinaryResponse.error) {
                        return next(new ErrorHandler("failed to upload resume", 400));
                    }
                }
                else {
                    return next(new ErrorHandler("multiple files attached", 400));
                }

                if (cloudinaryResponse) {
                    newUserData.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url,
                    }
                }
            }
            catch (e: any) {
                return next(new ErrorHandler(e, 500));
            }
        }
    }

    const user = await prisma.user.update({
        where:{
            id:req.user?.id
        },
        data:{
            ...newUserData
        }
    })
    res.status(200).json({
        success: true,
        user,
        message: "Profile updated.",
      });
})



export const updatePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction)=>{

    if(req.user?.password != req.body.oldPassword){
        return next(new ErrorHandler("please enter the correct old Password", 400));
    }


    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("New password & confirm password do not match." , 400));
    }   

    const user = await prisma.user.update({
        where:{
            id:req.user?.id
        },
        data:{
            password:req.body.newPassword
        }
    })


    SendToken(user, 200, res, "Password updated successfully.");

})




