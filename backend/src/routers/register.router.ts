import { Router } from "express";
import registerService from "../services/register.service";

const registerRouter = Router();

registerRouter.post("/", registerService.register);

export default registerRouter;
