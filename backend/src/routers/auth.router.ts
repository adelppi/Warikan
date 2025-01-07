import { Router } from "express";
import authService from "../services/auth.service";

const authRouter = Router();

authRouter.post("/register", authService.register);

export default authRouter;
