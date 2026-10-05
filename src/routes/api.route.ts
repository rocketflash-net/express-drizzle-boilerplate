import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { appConfig } from "@config/app.config";
import ResponseDto from "@dto/response.dto";
import v1Route from "@routes/v1/index.route";

const router = Router();

const healthCheck = (_req: Request, res: Response) => {
  const response = new ResponseDto().setResponseMessage(`${appConfig.name} is running`).setData({ env: appConfig.env, uptime: Math.floor(process.uptime()) });
  res.status(StatusCodes.OK).json(response.toArray());
};

router.get("/", healthCheck);
router.get("/health", healthCheck);

router.use("/api/v1", v1Route);

export default router;
