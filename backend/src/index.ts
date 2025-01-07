import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { prismaClient } from "./prisma";
import authRouter from "./routers/auth.router";
import sampleRouter from "./routers/sample.router";
import "dotenv/config";

if (!process.env.PORT) {
   throw new Error("PORTないよ");
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

// メイン部分
app.use("/auth", authRouter);
app.use("/sample", sampleRouter);

const shutdown = () => {
   console.info("Gracefully shutting down");
   prismaClient
      .$disconnect()
      .then(() => {
         httpServer.close(() => {
            console.info("HTTP server closed");
            process.exit(0);
         });
      })
      .catch((err) => {
         console.error("Error during shutdown", err);
         process.exit(1);
      });
};

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);

httpServer.listen(PORT, () => {
   console.info(`http://localhost:${PORT}`);
});
