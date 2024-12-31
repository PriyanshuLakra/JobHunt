

import  express  from "express";
import { getUser, login, logout, register, updatePassword, updateProfile } from "../controllers/UserController";
import { isAuthenticated } from "../Middlewares/auth";


const router = express.Router();

router.post("/register" , register);
router.post("/login" , login);


router.get('/logout' , isAuthenticated , logout);
router.get("/getUser" , isAuthenticated , getUser);
router.put("/updateProfile" , isAuthenticated , updateProfile)
router.put("/updatePassword" , isAuthenticated , updatePassword);



export default router