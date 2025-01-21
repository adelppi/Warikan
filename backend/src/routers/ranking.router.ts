import { Router } from "express";
import rankingService from "../services/ranking.service";

const rankingRouter = Router();

rankingRouter.get("/", rankingService.ranking);
rankingRouter.post("/", rankingService.rankingPost);

export default rankingRouter;
