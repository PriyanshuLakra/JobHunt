
import  express  from "express";
import { deleteJob, getAllJobs, getASingleJob, getMyJobs, postJob } from "../controllers/JobController";
import { isAuthenticated, isAuthorized } from "../Middlewares/auth";
const router = express.Router();


router.post("/postjob" , isAuthenticated ,isAuthorized("Employer"),postJob)
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteJob);
router.get("/get/:id", getASingleJob)

export default router