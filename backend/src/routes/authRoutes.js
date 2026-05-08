import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);
