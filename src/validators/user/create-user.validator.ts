import { body } from "express-validator";

export default [
  body("name").trim().notEmpty().withMessage("name field is required").isLength({ max: 150 }).withMessage("name max 150 characters"),
  body("email").trim().notEmpty().withMessage("email field is required").isEmail().withMessage("email is not valid").normalizeEmail(),
  body("phone").optional({ values: "null" }).trim().isMobilePhone("any").withMessage("phone is not valid"),
];
