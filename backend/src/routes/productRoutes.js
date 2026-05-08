import { Router } from "express";
import {
  getProducts,
  searchProducts,
  getFeaturedProducts,
  getCategories,
  getHomepageData,
  getProduct,
  createProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

export const productRouter = Router();

// Public routes
productRouter.get("/", getProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/homepage", getHomepageData);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get("/categories", getCategories);
productRouter.get("/:id", getProduct);

// Protected admin routes
productRouter.post("/", protect, adminOnly, upload.single("image"), createProduct);


