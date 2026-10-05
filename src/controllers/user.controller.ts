import { Request, Response } from "express";
import { matchedData } from "express-validator";
import UserService from "@services/user.service";
import { parsePagination } from "@utils/pagination.util";
import { CreateUserType, UpdateUserType } from "@@types/user.type";

// Controller hanya bertugas: ambil input dari request -> panggil service -> kirim response.
// Tidak ada business logic di sini. Error yang di-throw otomatis diteruskan ke error middleware (Express 5).
const service = new UserService();

const index = async (req: Request, res: Response) => {
  const { search } = matchedData<{ search?: string }>(req, { locations: ["query"] });
  const result = await service.findAll({ search }, parsePagination(req.query));
  res.status(result.status).json(result.data);
};

const show = async (req: Request, res: Response) => {
  const result = await service.findById(Number(req.params.id));
  res.status(result.status).json(result.data);
};

const store = async (req: Request, res: Response) => {
  const payload = matchedData<CreateUserType>(req, { locations: ["body"] });
  const result = await service.store(payload);
  res.status(result.status).json(result.data);
};

const update = async (req: Request, res: Response) => {
  const payload = matchedData<UpdateUserType>(req, { locations: ["body"] });
  const result = await service.update(Number(req.params.id), payload);
  res.status(result.status).json(result.data);
};

const destroy = async (req: Request, res: Response) => {
  const result = await service.destroy(Number(req.params.id));
  res.status(result.status).json(result.data);
};

export { index, show, store, update, destroy };
