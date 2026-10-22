import express from "express";
import { answerQuestion } from "../controllers/ragController.js";

const router = express.Router();

router.post("/ask", answerQuestion);

export default router;
