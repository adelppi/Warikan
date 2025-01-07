import { Request, Response } from "express";
import { ErrorCodes } from "../constant";
import { sendErrorResponse, sendSuccessResponse } from "../lib/sendResponse";

class authService {
   public static async register(req: Request, res: Response) {
      try {
         // 登録処理
         console.log("登録処理");

         return sendSuccessResponse(res, 201, {
            message: "登録処理",
         });
      } catch (error) {
         console.error(error);
         return sendErrorResponse(res, 500, {
            code: ErrorCodes.INTERNAL_SERVER_ERROR,
         });
      }
   }
}

export default authService;
