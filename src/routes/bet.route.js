import { Router } from "express";
import { getAllBets, getMyBets, makeBet } from "../controllers/bet.controller.js";

const router = Router();

router.get("/me", getMyBets);
router.get("/", getAllBets);
router.post("/", makeBet);


export default router;