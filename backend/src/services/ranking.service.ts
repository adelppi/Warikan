import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../lib/sendResponse";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

class rankingService {
   public static async ranking(req: Request, res: Response) {
      try {
         const score = await prisma.gameScore.findMany({
            orderBy: { time: "asc" },
            include: {
               user: true,
            },
         });

         const result = score.map((score) => ({
            id: score.id,
            time: score.time,
            createdAt: score.createdAt,
            username: score.user?.username,
         }));

         sendSuccessResponse(res, "OK", {
            message: "Rankings",
            data: result,
         });
      } catch (error) {
         console.error(error);
         return sendErrorResponse(res, "INTERNAL_SERVER_ERROR", {
            message: "Internal Server Error",
         });
      }
   }

   public static async rankingPost(req: Request, res: Response) {
      try {
         const { username, userId, time } = req.body;

         try {
            if (!username) {
               const newUser = await prisma.user.create({
                  data: {
                     username: username,
                  },
               });
            }
         } catch (error) {
            console.error(error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
               if (error.code === "P2002") {
                  return sendErrorResponse(res, "ALREADY_EXISTS", {
                     message: "User already exists",
                  });
               }
            }

            return sendErrorResponse(res, "DATABASE_ERROR", {
               message: "An error occurred while creating user",
            });
         }

         const upsertScore = await prisma.gameScore.upsert({
            where: { userId: userId },
            update: {
               time,
            },
            create: {
               userId: userId,
               time: time,
            },
         });

         this.ranking;
      } catch (error) {
         return sendErrorResponse(res, "INTERNAL_SERVER_ERROR", {
            message: "Internal Server Error",
         });
      }
   }
}

export default rankingService;
