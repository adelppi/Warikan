import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../lib/sendResponse";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

interface User {
   id: string;
   createdAt: Date;
   updatedAt: Date;
   username: string;
}

class rankingService {
   protected static async createRanking() {
      const score = await prisma.score.findMany({
         orderBy: {
            time: "asc",
         },
         include: {
            user: true,
         },
      });

      const ranking = score.map((s) => ({
         username: s.user.username,
         time: s.time,
      }));

      return ranking;
   }

   public static async getRanking(req: Request, res: Response) {
      try {
         const ranking = await rankingService.createRanking();

         return sendSuccessResponse(res, "OK", {
            message: "ranking",
            data: { ranking: ranking },
         });
      } catch (error) {
         console.error(error);
         return sendErrorResponse(res, "INTERNAL_SERVER_ERROR", {
            message: "Internal Server Error",
         });
      }
   }

   public static async updateRanking(req: Request, res: Response) {
      try {
         const { username, userId, time } = req.body;

         let user: User | null = await prisma.user.findUnique({
            where: { id: userId || "unknown" },
         });

         if (!user) {
            console.log("ユーザーを作ります...");
            user = await prisma.user.create({
               data: {
                  username: username,
               },
            });
         }

         await prisma.score.upsert({
            where: { userId: user.id },
            create: {
               userId: user.id,
               time: time,
            },
            update: { time: time },
         });

         const ranking = await rankingService.createRanking();

         return sendSuccessResponse(res, "OK", {
            message: "ランキングを更新しました",
            data: { userId: user.id, ranking: ranking },
         });
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
               return sendErrorResponse(res, "ALREADY_EXISTS", {
                  message: "すでに存在するユーザーです。名前を変えてください。",
               });
            }

            return sendErrorResponse(res, "DATABASE_ERROR", {
               message: error.message,
            });
         }
         console.error(error);
         return sendErrorResponse(res, "INTERNAL_SERVER_ERROR", {
            message: "Internal Server Error",
         });
      }
   }
}

export default rankingService;
