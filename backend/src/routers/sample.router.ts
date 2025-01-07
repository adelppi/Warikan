import { Router } from "express";
import sampleService from "../services/sample.servide";

const sampleRouter = Router();

sampleRouter.get("/", sampleService.sample);

export default sampleRouter;
