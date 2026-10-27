import { Router } from "express";
import { createMarket, getMarkets } from "../controllers/market.controller.js";

const router = Router();

router.post("/", createMarket);
router.get("/", getMarkets);

export default router;