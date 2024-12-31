"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
// statusCode does not exits in our Error class .. so we made new class ErrorHandler which also has statusCode property
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error.";
    if (err.name === "CastError") {
        const message = `Invalid path`;
        err = new ErrorHandler(message, 400);
    }
    if (err.statusCode === 11000) {
        const message = `Duplication  Entered.`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again.`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is expired, Try again.`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.errorMiddleware = errorMiddleware;
exports.default = ErrorHandler;
