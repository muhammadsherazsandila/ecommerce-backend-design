import cors from "cors";
import compression from "compression";
import express from "express";

import { router as apiRouter } from "./routes/index.js";

export const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const allowedOrigins = corsOrigin.split(",").map((o) => o.trim());

app.use(compression());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      // In dev, also allow any localhost port
      if (origin.startsWith("http://localhost:")) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
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
