import { env, envBoolean, envNumber } from "@config/env.config";
import EnvEnum from "@enums/env.enum";

const appConfig = {
  name: env("APP_NAME", "Express Drizzle Service"),
  env: env("NODE_ENV", EnvEnum.local),
  port: envNumber("PORT", 3000),
  secretKey: env("SECRET_KEY"),
  useLogger: envBoolean("USE_LOGGER", true),
  useCompression: envBoolean("USE_COMPRESSION", false),
  useLimiter: envBoolean("USE_LIMITER", false),
};

const isProduction = (): boolean => appConfig.env === EnvEnum.production;

export { appConfig, isProduction };
