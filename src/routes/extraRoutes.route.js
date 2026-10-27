import { Router } from "express";
import { onRampController, transactionController, profileController } from "../controllers/extra.controller.js";

const router = Router();

router.post("/onramp", onRampController);
router.get("/transactions", transactionController);
router.get("/profile", profileController);

export default router;