import { Response } from "express";

interface SuccessResponseOptions {
   message?: string;
   data?: unknown;
}

interface ErrorResponseOptions {
   code?: string;
   message?: string;
}

/**
 * 成功時のレスポンスを送信する
 *
 * @param res - ExpressのResponse
 * @param statusCode - HTTPステータスコード (デフォルト: 200)
 * @param options - `{ data?: unknown; message?: string; }`
 */
export const sendSuccessResponse = (
   res: Response,
   statusCode: number = 200,
   options: SuccessResponseOptions = {}
) => {
   const { message, data } = options;

   const response = {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { body: data }),
   };

   res.status(statusCode).json(response);
};

/**
 * エラーレスポンスを送信する
 *
 * @param res - Express レスポンスオブジェクト
 * @param statusCode - HTTPステータスコード (デフォルト: 500)
 * @param options - `{ code?: string; message?: string; }`
 */
export const sendErrorResponse = (
   res: Response,
   statusCode: number = 500,
   options: ErrorResponseOptions = {}
) => {
   const { code, message } = options;

   const response = {
      success: false,
      error: {
         ...(code && { code }),
         ...(message && { message }),
      },
   };

   res.status(statusCode).json(response);
};
