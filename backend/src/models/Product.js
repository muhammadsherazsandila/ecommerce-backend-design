import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    oldPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    orders: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    shipping: {
      type: String,
      default: "Standard Shipping",
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
productSchema.index({ name: "text", category: "text", description: "text", brand: "text" });

export const Product = mongoose.model("Product", productSchema);
