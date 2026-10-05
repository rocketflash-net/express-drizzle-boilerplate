import { query } from "express-validator";
import PaginationValidator from "@validators/common/pagination.validator";

export default [...PaginationValidator, query("search").optional().isString().trim().isLength({ max: 100 }).withMessage("search max 100 characters")];
