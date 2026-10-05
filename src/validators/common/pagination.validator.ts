import { query } from "express-validator";
import { MAX_LIMIT } from "@utils/pagination.util";

export default [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: MAX_LIMIT }).withMessage(`limit must be between 1 and ${MAX_LIMIT}`),
];
