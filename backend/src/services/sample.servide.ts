import { Request, Response } from "express";
import { ErrorCodes } from "../constant";
import { sendErrorResponse, sendSuccessResponse } from "../lib/sendResponse";

class sampleService {
   public static async sample(req: Request, res: Response) {
      try {
         // 処理
         console.log("サンプル処理");

         return sendSuccessResponse(res, 201, {
            message: "サンプル処理", // メモ程度の情報
            data: {
               randomValue1: 123,
               randomValue2: "ok",
            },
            // dataを指定すると、axiosで取得した時に、
            // `response.data.body.randomValue1`
            // のように受け取ることができる
         });
      } catch (error) {
         // ハンドルしていない不明なエラーの場合は、INTERNAL SERVER ERRORを返す
         console.error(error);
         return sendErrorResponse(res, 500, {
            code: ErrorCodes.INTERNAL_SERVER_ERROR,
         });
      }
   }
}

export default sampleService;
