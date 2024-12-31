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
exports.updatePassword = exports.updateProfile = exports.getUser = exports.logout = exports.login = exports.register = void 0;
const catchAsyncError_1 = require("../Middlewares/catchAsyncError");
const error_1 = __importDefault(require("../Middlewares/error"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const client_1 = require("@prisma/client");
const JWToken_1 = require("../utils/JWToken");
const prisma = new client_1.PrismaClient();
exports.register = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, password, address, Firstniche, Secondniche, Thirdniche, coverletter, role } = req.body;
        if (!name || !email || !phone || !password || !address || !role) {
            return next(new error_1.default("please provide all information ", 400));
        }
        if (role === "JobSeeker" && (!Firstniche || !Secondniche || !Thirdniche)) {
            return next(new error_1.default("provide all three niches", 400));
        }
        const existingUser = yield prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return next(new error_1.default("email already exists", 400));
        }
        const userData = {
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
                    let cloudinaryResponse;
                    if (!Array.isArray(resume)) {
                        cloudinaryResponse = yield cloudinary_1.default.v2.uploader.upload(resume.tempFilePath, { folder: "JOB_Seeker_Resume" });
                        if (!cloudinaryResponse || cloudinaryResponse.error) {
                            return next(new error_1.default("failed to upload resume", 400));
                        }
                    }
                    else {
                        return next(new error_1.default("multiple files attached", 400));
                    }
                    if (cloudinaryResponse) {
                        userData.resume = {
                            public_id: cloudinaryResponse.public_id,
                            url: cloudinaryResponse.secure_url,
                        };
                    }
                }
                catch (e) {
                    return next(new error_1.default(e, 500));
                }
            }
        }
        const user = yield prisma.user.create({
            data: Object.assign({}, userData)
        });
        (0, JWToken_1.SendToken)(user, 201, res, "User Registered");
    }
    catch (e) {
        next(e);
    }
}));
exports.login = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
        return next(new error_1.default("please provide role , email and password", 400));
    }
    const user = yield prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (!user) {
        return next(new error_1.default("user with this email does not exists", 400));
    }
    if (password !== user.password || email !== user.email || role !== user.role) {
        return next(new error_1.default("wrong Password for this role", 400));
    }
    (0, JWToken_1.SendToken)(user, 200, res, "User logied in Successifully");
}));
exports.logout = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => {
    res.status(200).cookie("token", "").json({
        success: true,
        message: "logged out successfully"
    });
});
exports.getUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => {
    const user = req.user;
    res.status(201).json({
        success: true,
        user
    });
});
exports.updateProfile = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const newUserData = {
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
    };
    const { Firstniche, Secondniche, Thirdniche } = newUserData.niches;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "JobSeeker" && ((!Firstniche) || !Secondniche || !Thirdniche)) {
        next(new error_1.default("please provide all three niches", 400));
    }
    if (req.files) {
        const resume = req.files["resume"];
        if (resume && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.resume)) {
            try {
                const currentResumeId = req.user.resume.public_id;
                if (currentResumeId) {
                    yield cloudinary_1.default.v2.uploader.destroy(currentResumeId);
                }
                if (!Array.isArray(resume)) {
                    const newResume = yield cloudinary_1.default.v2.uploader.upload(resume.tempFilePath, { folder: "JOB_Seeker_Resume" });
                    newUserData.resume = {
                        public_id: newResume.public_id,
                        url: newResume.secure_url,
                    };
                }
            }
            catch (e) {
                return next(new error_1.default(e, 500));
            }
        }
        else if (resume && !((_c = req.user) === null || _c === void 0 ? void 0 : _c.resume)) {
            try {
                let cloudinaryResponse;
                if (!Array.isArray(resume)) {
                    cloudinaryResponse = yield cloudinary_1.default.v2.uploader.upload(resume.tempFilePath, { folder: "JOB_Seeker_Resume" });
                    if (!cloudinaryResponse || cloudinaryResponse.error) {
                        return next(new error_1.default("failed to upload resume", 400));
                    }
                }
                else {
                    return next(new error_1.default("multiple files attached", 400));
                }
                if (cloudinaryResponse) {
                    newUserData.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url,
                    };
                }
            }
            catch (e) {
                return next(new error_1.default(e, 500));
            }
        }
    }
    const user = yield prisma.user.update({
        where: {
            id: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id
        },
        data: Object.assign({}, newUserData)
    });
    res.status(200).json({
        success: true,
        user,
        message: "Profile updated.",
    });
}));
exports.updatePassword = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    if (((_e = req.user) === null || _e === void 0 ? void 0 : _e.password) != req.body.oldPassword) {
        return next(new error_1.default("please enter the correct old Password", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new error_1.default("New password & confirm password do not match.", 400));
    }
    const user = yield prisma.user.update({
        where: {
            id: (_f = req.user) === null || _f === void 0 ? void 0 : _f.id
        },
        data: {
            password: req.body.newPassword
        }
    });
    (0, JWToken_1.SendToken)(user, 200, res, "Password updated successfully.");
}));
