import { body } from "express-validator";
import IdParamValidator from "@validators/common/id-param.validator";

export default [
  ...IdParamValidator,
  body("name").optional().trim().notEmpty().withMessage("name cannot be empty").isLength({ max: 150 }).withMessage("name max 150 characters"),
  body("email").optional().trim().isEmail().withMessage("email is not valid").normalizeEmail(),
  body("phone").optional({ values: "null" }).trim().isMobilePhone("any").withMessage("phone is not valid"),
  body("isActive").optional().isBoolean({ strict: true }).withMessage("isActive must be boolean"),
];
