import { Router } from "express";
import sampleService from "../services/sample.service";

const sampleRouter = Router();

sampleRouter.get("/", sampleService.sample);

export default sampleRouter;
