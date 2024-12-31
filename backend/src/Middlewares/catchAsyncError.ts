import {Response,Request, NextFunction } from "express";

export const catchAsyncError = (theFunction:Function) => {
    return (req:Request, res:Response, next:NextFunction) => {
      Promise.resolve(theFunction(req, res, next)).catch(next);
    };
  };

  