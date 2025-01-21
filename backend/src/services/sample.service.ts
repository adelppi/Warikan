import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../lib/sendResponse";

class sampleService {
   public static async sample(req: Request, res: Response) {
      try {
         console.log("sample");

         return sendSuccessResponse(res, "OK", {
            message: "sample",
            data: {
               randomValue1: 123,
               randomValue2: "ok",
            },
         });
      } catch (error) {
         console.error(error);
         return sendErrorResponse(res, "INTERNAL_SERVER_ERROR", {
            message: "Internal Server Error",
         });
      }
   }
}

export default sampleService;
