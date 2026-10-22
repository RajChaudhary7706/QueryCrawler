import express from "express";
import { startCrawlProcess } from "../controllers/crawlController.js";

const router = express.Router();

router.post("/start", startCrawlProcess);

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Crawl router working" });
});

export default router;
