import {
  Check,
  ChevronRight,
  Globe,
  Heart,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { productsAPI } from "../api";

const ProductDetails = ({ setPage, productId, setSelectedProductId }) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThumb, setSelectedThumb] = useState(0);

  useEffect(() => {
    if (!productId) {
      setPage("listing");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productsAPI.getById(productId);
        if (data.success) {
          setProduct(data.product);

          // Fetch related products from the same category
          const relatedRes = await productsAPI.getAll({
            category: data.product.category,
            limit: 6,
          });
          if (relatedRes.data.success) {
            setRelatedProducts(
              relatedRes.data.products.filter((p) => p._id !== productId),
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#0D6EFD] animate-spin" />
          <p className="text-[#8B96A5] text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">
          Product not found
        </h3>
        <button
          onClick={() => setPage("listing")}
          className="text-primary font-medium hover:underline"
        >
          Back to products
        </button>
      </div>
    );
  }

  const productImage =
    product.image || "https://via.placeholder.com/400x400?text=No+Image";
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="container py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => setPage("home")}
        >
          Home
        </span>
        <ChevronRight className="w-4 h-4" />
        <span
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => setPage("listing")}
        >
          Products
        </span>
        <ChevronRight className="w-4 h-4" />
        <span
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => {
            setPage("listing");
          }}
        >
          {product.category}
        </span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-normal truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-5 lg:p-8 flex flex-col lg:flex-row gap-8 mb-8 shadow-sm">
        {/* Gallery Section */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
          <div className="border border-[#DEE2E7] rounded-lg p-6 lg:p-8 mb-4 flex items-center justify-center bg-[#F7F7F7] aspect-square overflow-hidden group relative">
            <img
              src={productImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x400?text=No+Image";
              }}
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#FA3434] text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-[#00B517]">
                <Check size={20} />
                <span className="text-sm font-medium">
                  In stock ({product.stock})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#FA3434]">
                <span className="text-sm font-medium">Out of stock</span>
              </div>
            )}
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1C1C1C] mb-4">
            {product.name}
          </h1>

          {/* Ratings & Orders */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-[#FF9017] text-[#FF9017]"
                        : "text-[#D1D3D3]"
                    }
                  />
                ))}
              <span className="text-[#FF9017] text-sm ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#8B96A5] text-sm">
              <ShoppingBag size={16} />
              <span>{product.orders} sold</span>
            </div>
            {product.featured && (
              <span className="bg-[#FF9017]/10 text-[#FF9017] text-xs font-bold px-3 py-1 rounded-full">
                ★ Featured
              </span>
            )}
          </div>

          {/* Pricing Block */}
          <div className="bg-[#FFF0DF] p-4 rounded-lg flex flex-wrap gap-8 items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xl lg:text-3xl font-bold text-[#FA3434]">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-[#8B96A5] line-through mt-1">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <>
                <div className="h-10 w-[1px] bg-[#DEE2E7] hidden lg:block"></div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#00B517]">
                    Save {discount}%
                  </span>
                  <span className="text-xs text-[#505050]">
                    ${(product.oldPrice - product.price).toFixed(2)} off
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Product Meta Info */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <span className="text-[#8B96A5]">Category:</span>
              <span className="col-span-2 lg:col-span-3 text-[#505050]">
                {product.category}
              </span>
            </div>
            {product.brand && (
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 text-sm border-t border-[#DEE2E7] pt-4">
                <span className="text-[#8B96A5]">Brand:</span>
                <span className="col-span-2 lg:col-span-3 text-[#505050]">
                  {product.brand}
                </span>
              </div>
            )}
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 text-sm border-t border-[#DEE2E7] pt-4">
              <span className="text-[#8B96A5]">Shipping:</span>
              <span className="col-span-2 lg:col-span-3 text-[#00B517] font-medium">
                {product.shipping}
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-[#DEE2E7] mb-8"></div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              className="flex-1 min-w-[150px] bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold transition-colors"
              onClick={() => setPage("cart")}
            >
              Buy Now
            </button>
            <button
              className="flex-1 min-w-[150px] bg-[#E3F0FF] hover:bg-[#D1E9FF] text-primary py-3 rounded-lg font-bold transition-colors"
              onClick={() => setPage("cart")}
            >
              Add to Cart
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-[#DEE2E7] rounded-lg text-primary hover:bg-shade transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar / Seller Info Section */}
        <div className="lg:w-[280px] space-y-4">
          {/* Seller Module */}
          <div className="bg-white border border-[#DEE2E7] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-md bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-xl uppercase">
                {product.brand ? product.brand[0] : "S"}
              </div>
              <div className="flex flex-col">
                <span className="text-[#1C1C1C] font-normal">Supplier</span>
                <span className="text-[#505050] text-sm">
                  {product.brand || "Official Store"}
                </span>
              </div>
            </div>
            <div className="h-[1px] bg-[#DEE2E7] mb-4"></div>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm text-[#8B96A5]">
                <ShieldCheck size={18} />
                <span>Verified Seller</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8B96A5]">
                <Globe size={18} />
                <span>Worldwide shipping</span>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Send inquiry
              </button>
              <button className="w-full bg-white text-primary border border-[#DEE2E7] py-2 rounded-lg text-sm font-medium hover:bg-shade transition-colors">
                Seller's profile
              </button>
            </div>
          </div>

          <div className="text-center p-4">
            <button className="flex items-center justify-center gap-2 text-primary font-medium hover:underline text-sm w-full">
              <Heart size={18} />
              <span>Save for later</span>
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden mb-8">
            <div className="flex border-b border-[#DEE2E7] bg-white overflow-x-auto no-scrollbar">
              {["Description", "Reviews", "Shipping"].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${i === 0 ? "text-primary border-primary" : "text-[#8B96A5] border-transparent hover:text-primary"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6 lg:p-8">
              <p className="text-[#505050] text-sm lg:text-base leading-relaxed mb-6">
                {product.description ||
                  "No description available for this product."}
              </p>
              <table className="w-full text-sm lg:text-base mb-8 rounded overflow-hidden border-collapse">
                <tbody>
                  <tr className="border border-[#DEE2E7]">
                    <td className="w-1/3 bg-[#F7FAFC] p-3 text-[#505050] font-medium border-r border-[#DEE2E7]">
                      Category
                    </td>
                    <td className="p-3 text-[#505050]">{product.category}</td>
                  </tr>
                  {product.brand && (
                    <tr className="border border-[#DEE2E7]">
                      <td className="w-1/3 bg-[#F7FAFC] p-3 text-[#505050] font-medium border-r border-[#DEE2E7]">
                        Brand
                      </td>
                      <td className="p-3 text-[#505050]">{product.brand}</td>
                    </tr>
                  )}
                  <tr className="border border-[#DEE2E7]">
                    <td className="w-1/3 bg-[#F7FAFC] p-3 text-[#505050] font-medium border-r border-[#DEE2E7]">
                      Rating
                    </td>
                    <td className="p-3 text-[#505050]">
                      {product.rating.toFixed(1)} / 5.0
                    </td>
                  </tr>
                  <tr className="border border-[#DEE2E7]">
                    <td className="w-1/3 bg-[#F7FAFC] p-3 text-[#505050] font-medium border-r border-[#DEE2E7]">
                      Stock
                    </td>
                    <td className="p-3 text-[#505050]">
                      {product.stock} units
                    </td>
                  </tr>
                  <tr className="border border-[#DEE2E7]">
                    <td className="w-1/3 bg-[#F7FAFC] p-3 text-[#505050] font-medium border-r border-[#DEE2E7]">
                      Shipping
                    </td>
                    <td className="p-3 text-[#505050]">{product.shipping}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="bg-white border border-[#DEE2E7] rounded-lg p-5 lg:p-6 mb-8">
          <h4 className="font-bold text-[#1C1C1C] text-lg mb-4">
            Related products
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedProducts.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 group cursor-pointer"
                onClick={() => {
                  setSelectedProductId(item._id);
                }}
              >
                <div className="w-full aspect-square border border-[#DEE2E7] rounded-lg p-3 flex items-center justify-center bg-white group-hover:shadow-[0px_4px_15px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 transition-all duration-300">
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/150x150?text=No+Image"
                    }
                    alt={item.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150x150?text=No+Image";
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#505050] text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[#1C1C1C] text-sm font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Super Discount Banner */}
      <div className="bg-gradient-to-r from-primary to-[#005ADE] rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">
            Super discount on more than 100 USD
          </h2>
          <p className="opacity-80 text-sm">
            Exclusive deals available for all registered members.
          </p>
        </div>
        <button
          className="relative z-10 bg-[#FF9017] hover:bg-[#E38015] text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg"
          onClick={() => setPage("listing")}
        >
          Shop now
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
      </div>
    </div>
  );
};

export default ProductDetails;
