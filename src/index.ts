import "./paths";
import { appConfig } from "@config/app.config";
import { checkDatabaseConnection, closeDatabaseConnection } from "@config/database.config";
import createApp from "./app";

const bootstrap = async (): Promise<void> => {
  // Fail fast: jangan terima request kalau database tidak bisa diakses.
  await checkDatabaseConnection();

  const app = createApp();
  const server = app.listen(appConfig.port, () => {
    console.log(`${appConfig.name} listening on port ${appConfig.port} environment ${appConfig.env}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close(async () => {
      await closeDatabaseConnection();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
