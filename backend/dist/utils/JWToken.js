"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWTToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d", // Default to 7 days if not specified
    });
};
const SendToken = (user, statusCode, res, message) => {
    const token = generateJWTToken(user.id);
    return res.status(statusCode).cookie("token", token).json({
        success: true,
        user,
        message,
        token
    });
};
exports.SendToken = SendToken;
