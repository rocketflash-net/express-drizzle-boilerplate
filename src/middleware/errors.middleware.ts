import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { isProduction } from "@config/app.config";
import ResponseDto from "@dto/response.dto";
import ResponseCodeEnum from "@enums/response-code.enum";
import HttpException from "@exceptions/http.exception";

const isJsonSyntaxError = (err: Error): boolean => err instanceof SyntaxError && "body" in err;

// Error handler global. Harus didaftarkan paling akhir di app.ts.
const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const response = new ResponseDto();

  if (err instanceof HttpException) {
    response.setResponseCode(err.code).setResponseMessage(err.message).setAdditionalInfo(err.additionalInfo);
    res.status(err.status).json(response.toArray());
    return;
  }

  if (isJsonSyntaxError(err)) {
    response.setResponseCode(ResponseCodeEnum.bad_request).setResponseMessage("Invalid JSON payload");
    res.status(StatusCodes.BAD_REQUEST).json(response.toArray());
    return;
  }

  // Error tak terduga: log detailnya, tapi jangan bocorkan ke client di production.
  console.error("[Unhandled Error]", err);
  response.setResponseCode(ResponseCodeEnum.general_error).setResponseMessage(isProduction() ? "Internal server error" : err.message);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response.toArray());
};

export default errorHandler;
