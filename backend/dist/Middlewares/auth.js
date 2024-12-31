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
exports.isAuthorized = exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("./catchAsyncError");
const error_1 = __importDefault(require("./error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        return next(new error_1.default("user is not authenticated", 400));
    }
    const secret = process.env.JWT_SECRET_KEY || "";
    const decode = jsonwebtoken_1.default.verify(token, secret);
    const finding = yield prisma.user.findFirst({
        where: {
            id: decode.id,
        }
    });
    if (finding) {
        req.user = finding;
    }
    next();
}));
const isAuthorized = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            return next(new error_1.default("Job posting is only allowed for Employeers", 400));
        }
        next();
    };
};
exports.isAuthorized = isAuthorized;
