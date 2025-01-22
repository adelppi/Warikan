import { Router } from "express";
import rankingService from "../services/ranking.service";

const rankingRouter = Router();

rankingRouter.get("/", rankingService.getRanking);
rankingRouter.post("/", rankingService.updateRanking);

export default rankingRouter;
