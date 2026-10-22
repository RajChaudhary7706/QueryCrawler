import express from "express";
import crawlRoutes from "./crawlRoutes.js";
import ragRoutes from "./ragRoutes.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ success: true });
});

router.use("/crawl", crawlRoutes);
router.use("/rag", ragRoutes);

export default router;
