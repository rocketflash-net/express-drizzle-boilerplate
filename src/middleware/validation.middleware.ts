import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import ValidationException from "@exceptions/validation.exception";

/**
 * Menjalankan kumpulan rule express-validator lalu melempar ValidationException jika ada yang gagal.
 * Pemakaian di route: router.post("/", validate(CreateUserValidator), store)
 */
const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((error) => ({ field: error.type === "field" ? error.path : error.type, message: error.msg }));
      throw new ValidationException(errors);
    }
    next();
  };
};

export default validate;
