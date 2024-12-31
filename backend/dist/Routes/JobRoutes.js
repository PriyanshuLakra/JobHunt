"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JobController_1 = require("../controllers/JobController");
const auth_1 = require("../Middlewares/auth");
const router = express_1.default.Router();
router.post("/postjob", auth_1.isAuthenticated, (0, auth_1.isAuthorized)("Employer"), JobController_1.postJob);
router.get("/getall", JobController_1.getAllJobs);
router.get("/getmyjobs", auth_1.isAuthenticated, (0, auth_1.isAuthorized)("Employer"), JobController_1.getMyJobs);
router.delete("/delete/:id", auth_1.isAuthenticated, (0, auth_1.isAuthorized)("Employer"), JobController_1.deleteJob);
router.get("/get/:id", JobController_1.getASingleJob);
exports.default = router;
