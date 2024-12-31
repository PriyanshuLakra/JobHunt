"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../Middlewares/auth");
const router = express_1.default.Router();
router.post("/register", UserController_1.register);
router.post("/login", UserController_1.login);
router.get('/logout', auth_1.isAuthenticated, UserController_1.logout);
router.get("/getUser", auth_1.isAuthenticated, UserController_1.getUser);
router.put("/updateProfile", auth_1.isAuthenticated, UserController_1.updateProfile);
router.put("/updatePassword", auth_1.isAuthenticated, UserController_1.updatePassword);
exports.default = router;
