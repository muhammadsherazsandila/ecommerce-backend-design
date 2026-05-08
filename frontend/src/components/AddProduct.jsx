import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  DollarSign,
  Tag,
  FileText,
  Image,
  Hash,
  Star,
  Truck,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { productsAPI } from "../api";

const AddProduct = ({ setPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "",
    description: "",
    stock: "",
    rating: "",
    brand: "",
    shipping: "Free Shipping",
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    productsAPI
      .getCategories()
      .then(({ data }) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }
    setError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    handleImageSelect(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.price || !formData.category) {
      setError("Name, price, and category are required");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      if (formData.oldPrice) payload.append("oldPrice", formData.oldPrice);
      payload.append("category", formData.category);
      if (formData.description) payload.append("description", formData.description);
      payload.append("stock", formData.stock || "0");
      payload.append("rating", formData.rating || "0");
      if (formData.brand) payload.append("brand", formData.brand);
      payload.append("shipping", formData.shipping);
      payload.append("featured", formData.featured);
      if (imageFile) {
        payload.append("image", imageFile);
      }

      const { data } = await productsAPI.create(payload);
      if (data.success) {
        setSuccess("Product created successfully!");
        setFormData({
          name: "",
          price: "",
          oldPrice: "",
          category: "",
          description: "",
          stock: "",
          rating: "",
          brand: "",
          shipping: "Free Shipping",
          featured: false,
        });
        removeImage();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/10 transition-all bg-[#F7FAFC] focus:bg-white";

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => setPage("listing")}
        className="flex items-center gap-2 text-[#8B96A5] hover:text-[#0D6EFD] transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft size={18} />
        Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#E3E8EE] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF9017] to-[#E38015] px-8 py-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-[0.06] rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Add New Product</h1>
              <p className="text-white/70 text-sm">
                Fill in the product details below
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Image Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
              Product Image
            </label>
            {imagePreview ? (
              <div className="relative border-2 border-[#0D6EFD] border-dashed rounded-xl p-4 bg-[#F0F6FF]">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-white border border-[#DEE2E7] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C] truncate">
                      {imageFile?.name}
                    </p>
                    <p className="text-xs text-[#8B96A5] mt-1">
                      {(imageFile?.size / 1024).toFixed(1)} KB •{" "}
                      {imageFile?.type}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00B517] bg-[#E8F8EA] px-2.5 py-1 rounded-full">
                        <CheckCircle size={12} />
                        Ready to upload
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="w-9 h-9 rounded-lg bg-white border border-[#DEE2E7] flex items-center justify-center text-[#FA3434] hover:bg-[#FFF0F0] hover:border-[#FA3434] transition-all flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-[#0D6EFD] bg-[#F0F6FF] scale-[1.01]"
                    : "border-[#DEE2E7] bg-[#F7FAFC] hover:border-[#0D6EFD] hover:bg-[#F0F6FF]"
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                    isDragging
                      ? "bg-[#0D6EFD]/10 text-[#0D6EFD]"
                      : "bg-[#E3E8EE] text-[#8B96A5]"
                  }`}
                >
                  <Upload size={28} />
                </div>
                <p className="text-sm font-semibold text-[#1C1C1C] mb-1">
                  {isDragging
                    ? "Drop your image here"
                    : "Drag & drop your image here"}
                </p>
                <p className="text-xs text-[#8B96A5] mb-3">
                  or click to browse from your device
                </p>
                <span className="inline-block text-xs text-[#8B96A5] bg-white px-3 py-1.5 rounded-full border border-[#DEE2E7]">
                  PNG, JPG, WEBP up to 5MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Product Name *
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="product-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Apple MacBook Pro 16-inch"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Old Price */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Old Price ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="product-oldprice"
                  name="oldPrice"
                  type="number"
                  step="0.01"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="0.00 (optional)"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="product-category"
                  name="category"
                  list="categories-list"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics"
                  className={inputClass}
                />
                <datalist id="categories-list">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Brand
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="product-brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., Apple"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Stock Quantity
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="product-stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Rating (0-5)
              </label>
              <div className="relative">
                <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="product-rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-[#8B96A5]" />
                <textarea
                  id="product-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a detailed description..."
                  rows={4}
                  className="w-full pl-12 pr-4 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/10 transition-all bg-[#F7FAFC] focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Shipping */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Shipping
              </label>
              <div className="relative">
                <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <select
                  id="product-shipping"
                  name="shipping"
                  value={formData.shipping}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Free Shipping">Free Shipping</option>
                  <option value="Standard Shipping">Standard Shipping</option>
                  <option value="Express Shipping">Express Shipping</option>
                </select>
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  id="product-featured"
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-[#DEE2E7] text-[#0D6EFD] focus:ring-[#0D6EFD]"
                />
                <span className="text-sm font-semibold text-[#1C1C1C] group-hover:text-[#0D6EFD] transition-colors">
                  Featured Product
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              id="product-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF9017] to-[#E38015] text-white py-4 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#FF9017]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {imageFile ? "Uploading image..." : "Creating product..."}
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
