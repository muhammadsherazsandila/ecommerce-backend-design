import { Router } from "express";
import {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";

export const productRouter = Router();

// Public routes
productRouter.get("/", getProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get("/categories", getCategories);
productRouter.get("/:id", getProduct);

// Protected admin routes
productRouter.post("/", protect, adminOnly, createProduct);
productRouter.put("/:id", protect, adminOnly, updateProduct);
productRouter.delete("/:id", protect, adminOnly, deleteProduct);
