"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_1 = require("./Middlewares/error");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const JobRoutes_1 = __importDefault(require("./Routes/JobRoutes"));
const ApplicationsRoutes_1 = __importDefault(require("./Routes/ApplicationsRoutes"));
const app = (0, express_1.default)();
(0, dotenv_1.config)({ path: './config/config.env' });
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/user", UserRoutes_1.default);
app.use("/api/v1/job", JobRoutes_1.default);
app.use("/api/V1/application", ApplicationsRoutes_1.default);
app.use(error_1.errorMiddleware);
exports.default = app;
