"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApplicationController_1 = require("../controllers/ApplicationController");
const auth_1 = require("../Middlewares/auth");
const router = express_1.default.Router();
router.post("/PostApplication/:job_id", auth_1.isAuthenticated, (0, auth_1.isAuthorized)("JobSeeker"), ApplicationController_1.PostApplication);
router.get("/jobSeekerGetAllApplication", auth_1.isAuthenticated, (0, auth_1.isAuthorized)("JobSeeker"), ApplicationController_1.jobSeekerGetAllApplication);
router.get("/employerGetAllApplication", auth_1.isAuthenticated, (0, auth_1.isAuthorized)("Employer"), ApplicationController_1.employerGetAllApplication);
router.delete("/deleteApplication/:id", auth_1.isAuthenticated, ApplicationController_1.deleteApplication);
exports.default = router;
