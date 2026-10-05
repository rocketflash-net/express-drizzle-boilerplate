import { StatusCodes } from "http-status-codes";
import { rateLimit } from "express-rate-limit";
import { envNumber } from "@config/env.config";
import ResponseDto from "@dto/response.dto";
import ResponseCodeEnum from "@enums/response-code.enum";

const globalLimiter = rateLimit({
  windowMs: envNumber("RATE_LIMIT_WINDOW_MS", 60 * 1000),
  limit: envNumber("RATE_LIMIT_MAX", 6000),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: () =>
    new ResponseDto().setResponseCode(ResponseCodeEnum.too_many_requests).setResponseMessage("Too many requests, please try again later.").toArray(),
});

export { globalLimiter };
