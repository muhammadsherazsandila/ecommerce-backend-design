import cors from "cors";
import express from "express";

import { router as apiRouter } from "./routes/index.js";

export const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Ecommerce API is running",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRouter);
