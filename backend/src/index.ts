import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import prismaClient from "./prisma";
import sampleRouter from "./routers/sample.router";
import registerRouter from "./routers/register.router";
import rankingRouter from "./routers/ranking.router";
if (!process.env.PORT) {
   throw new Error("PORT");
}
const PORT = Number(process.env.PORT);

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(
   cors({
      origin: "*",
      credentials: true,
      optionsSuccessStatus: 200,
   })
);

app.get("/status", (req: Request, res: Response) => {
   res.send({ status: "online" });
});

app.use("/", sampleRouter);
app.use("/register", registerRouter);
app.use("/ranking", rankingRouter);

const shutdown = () => {
   console.log("Gracefully shutting down");
   prismaClient
      .$disconnect()
      .then(() => {
         httpServer.close(() => {
            console.info("Http server closed");
            process.exit(0);
         });
      })
      .catch((err: Error) => {
         console.error("Error during shutdown", err);
         process.exit(1);
      });
};

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);

httpServer.listen(PORT, () => {
   console.info(`http://localhost:${PORT}`);
});
