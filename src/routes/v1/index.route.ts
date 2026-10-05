import { Router } from "express";
import userRoute from "@routes/v1/user.route";

// Semua route API versi 1 didaftarkan di sini -> prefix /api/v1
const router = Router();

router.use("/users", userRoute);

export default router;
