
import  express  from "express";
import { deleteApplication, employerGetAllApplication, jobSeekerGetAllApplication, PostApplication } from "../controllers/ApplicationController";
import { isAuthenticated, isAuthorized } from "../Middlewares/auth";

const router = express.Router();

router.post("/PostApplication/:job_id" ,isAuthenticated, isAuthorized("JobSeeker") ,PostApplication);
router.get("/jobSeekerGetAllApplication" , isAuthenticated , isAuthorized("JobSeeker") , jobSeekerGetAllApplication);
router.get("/employerGetAllApplication" , isAuthenticated , isAuthorized("Employer") , employerGetAllApplication);
router.delete("/deleteApplication/:id",isAuthenticated  , deleteApplication);

export default router

