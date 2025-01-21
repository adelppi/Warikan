import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../lib/sendResponse";
import PrismaClient from "../prisma";
import { Prisma } from "@prisma/client";

class registerService {
   public static async register(req: Request, res: Response) {
      try {
         const { username } = req.body;
         console.log("register");

         if (!username) {
            return sendErrorResponse(res, "MISSING_PARAMETERS", {
               message: "Invalid Request",
            });
         }

         const newUser = await PrismaClient.user.create({
            data: {
               username: username,
            },
         });

         return sendSuccessResponse(res, "CREATED", {
            message: "User created",
            data: { uid: newUser.id },
         });
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
   }
}

export default registerService;
