import "dotenv/config";
import cors from "cors";
import express from "express";
import apiRoutes from "./routes/index.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number(err.statusCode || err.status) || 500;
  const retryable = status === 429 || status === 503;

  res.status(status).json({
    success: false,
    error: err.message || "An unexpected server error occurred.",
    retryable,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
