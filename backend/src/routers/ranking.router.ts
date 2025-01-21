import { Router } from "express";
import rankingService from "../services/ranking.service";

const rankingRouter = Router();

rankingRouter.get("/", rankingService.ranking);

export default rankingRouter;
