import { NextFunction,Request ,Response} from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "./error";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface CustomJwtPayload extends JwtPayload {
    id: number; // Adjust to the actual type of `id` (e.g., `number` if applicable)
  }

import { User } from "@prisma/client"; // Assuming you're using Prisma's User model

declare global {
  namespace Express {
    export interface Request {
      user?: User; // Make it optional if user might not always be present
    }
  }
}
export const isAuthenticated = catchAsyncError(async (req:Request , res:Response , next:NextFunction)=>{

    const {token} = req.cookies

    if(!token){
        return next(new ErrorHandler("user is not authenticated" , 400));
    }
    
    const secret =  process.env.JWT_SECRET_KEY || "";
    
    const decode = jwt.verify(token , secret) as CustomJwtPayload;

    const finding = await prisma.user.findFirst({
        where:{
            id:decode.id,
        }
    })

    if(finding){
        req.user = finding
    }

    next();

})

export const isAuthorized = (...roles:any) => {
  return (req:Request, res:Response, next:NextFunction) => {
    
    if (!roles.includes(req.user?.role)) {
      return next(new ErrorHandler("Job posting is only allowed for Employeers" , 400));
    }
    next();
  };
};