import { Router } from "express";

export const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "API routes are ready",
  });
});

router.get("/products", (_req, res) => {
  res.json({
    products: [],
  });
});
