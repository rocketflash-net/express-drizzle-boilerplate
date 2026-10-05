import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
import { appConfig } from "@config/app.config";
import { maskSensitiveFields, maskSensitiveQueryParams } from "@utils/general.util";

const EXCLUDED_LOG_PATHS = ["/health"];

const formatPrefix = (requestId: string): string => `[${appConfig.name}] [reqId:${requestId}] [${appConfig.env.toUpperCase()}]`;

const parseBody = (body: unknown): unknown => {
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
};

/**
 * Log setiap incoming request & outgoing response (field sensitif di-mask).
 * Request id diambil dari header `x-request-id` (jika ada) lalu disimpan di httpContext.
 */
const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = req.header("x-request-id") ?? randomUUID();
  httpContext.set("requestId", requestId);
  res.setHeader("x-request-id", requestId);

  const path = req.path.replace(/\/+$/, "") || "/";
  if (EXCLUDED_LOG_PATHS.includes(path)) {
    next();
    return;
  }

  const url = maskSensitiveQueryParams(req.originalUrl);
  console.log(`${formatPrefix(requestId)} [Incoming Request] [${req.method}] ${url} - ${JSON.stringify({ body: maskSensitiveFields(req.body ?? {}) })}`);

  let responseBody: unknown;
  const originalSend = res.send.bind(res);
  res.send = ((body: unknown) => {
    responseBody = body;
    return originalSend(body);
  }) as Response["send"];

  res.on("finish", () => {
    const payload = {
      statusCode: res.statusCode,
      body: maskSensitiveFields(parseBody(responseBody) ?? {}),
      responseTime: `${Date.now() - startTime}ms`,
    };
    console.log(`${formatPrefix(requestId)} [Outgoing Response] ${JSON.stringify(payload)}`);
  });

  next();
};

export default loggingMiddleware;
