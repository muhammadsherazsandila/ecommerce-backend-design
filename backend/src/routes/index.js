import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { productRouter } from "./productRoutes.js";

export const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "API routes are ready",
  });
});

router.use("/auth", authRouter);
router.use("/products", productRouter);
