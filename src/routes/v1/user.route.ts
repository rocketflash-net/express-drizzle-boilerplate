import { Router } from "express";
import validate from "@middleware/validation.middleware";
import IdParamValidator from "@validators/common/id-param.validator";
import ListUserValidator from "@validators/user/list-user.validator";
import CreateUserValidator from "@validators/user/create-user.validator";
import UpdateUserValidator from "@validators/user/update-user.validator";
import { index, show, store, update, destroy } from "@controllers/user.controller";

const router = Router();

router.get("/", validate(ListUserValidator), index);
router.get("/:id", validate(IdParamValidator), show);
router.post("/", validate(CreateUserValidator), store);
router.put("/:id", validate(UpdateUserValidator), update);
router.delete("/:id", validate(IdParamValidator), destroy);

export default router;
