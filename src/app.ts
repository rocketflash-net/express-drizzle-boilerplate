import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import httpContext from "express-http-context";
import requestIp from "request-ip";
import { appConfig } from "@config/app.config";
import { globalLimiter } from "@config/rate-limit.config";
import routers from "@routes/api.route";
import errorHandler from "@middleware/errors.middleware";
import notFoundHandler from "@middleware/not-found.middleware";
import loggingMiddleware from "@middleware/logging.middleware";

/**
 * Membuat instance Express (middleware + routes). Proses listen port ada di index.ts.
 */
const createApp = () => {
  const app = express();

  app.set("trust proxy", true);
  app.use(cors({ credentials: true, origin: true }));
  app.use(helmet());
  app.use(requestIp.mw());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(httpContext.middleware);

  if (appConfig.useCompression) app.use(compression());
  if (appConfig.useLogger) app.use(loggingMiddleware);
  if (appConfig.useLimiter) app.use(globalLimiter);

  app.use(routers);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
