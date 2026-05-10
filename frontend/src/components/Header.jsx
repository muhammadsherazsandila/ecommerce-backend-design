import {
  ChevronDown,
  Heart,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Shield,
  ShoppingCart,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { productsAPI } from "../api";
import logo from "../assets/Layout/Brand/logo-colored.png";
import { useAuth } from "../context/AuthContext";

const Header = ({ setPage, onSearch }) => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    productsAPI
      .getCategories()
      .then(({ data }) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Live search with debounce
  const handleSearchInput = (value) => {
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const params = { q: value.trim(), limit: 6 };
        if (selectedCategory) params.category = selectedCategory;
        const { data } = await productsAPI.search(params);
        if (data.success) {
          setSuggestions(data.products);
          setShowSuggestions(true);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(searchTerm, selectedCategory);
    }
    setPage("listing");
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setSearchTerm("");
    if (onSearch) onSearch("", "");
    setPage("details");
    // We need setSelectedProductId but Header doesn't have it,
    // so we navigate to listing with the product name as search
    if (onSearch) onSearch(product.name, "");
    setPage("listing");
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setPage("home");
  };

  return (
    <header className="bg-white border-b border-shade-border lg:sticky top-0 z-50 shadow-sm">
      {/* Top Header */}
      <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setPage("home")}
        >
          <img src={logo} alt="Brand" className="h-10 md:h-[46px]" />
        </div>

        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl relative mt-3 md:mt-0"
          ref={searchRef}
        >
          <div className="flex border-2 border-primary rounded-lg overflow-hidden">
            {/* Category Dropdown */}
            <div className="relative border-r border-[#DEE2E7] bg-[#F7F7F7]">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (searchTerm.trim()) handleSearchInput(searchTerm);
                }}
                className="appearance-none bg-transparent px-4 py-2 pr-8 text-sm text-[#505050] outline-none cursor-pointer min-w-[130px]"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B96A5] pointer-events-none"
              />
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 outline-none"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-2 font-medium transition-colors"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DEE2E7] rounded-lg shadow-xl z-[60] overflow-hidden">
              {searchLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={18} className="text-[#0D6EFD] animate-spin" />
                </div>
              ) : suggestions.length > 0 ? (
                <div>
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F6FF] cursor-pointer transition-colors border-b border-[#F0F0F0] last:border-b-0"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <div className="w-10 h-10 bg-[#F7F7F7] rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={
                            product.image ||
                            "https://via.placeholder.com/40x40?text=..."
                          }
                          alt=""
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/40x40?text=...";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1C1C1C] truncate font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#8B96A5]">
                          {product.category}{" "}
                          {product.brand ? `• ${product.brand}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#1C1C1C] flex-shrink-0">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div
                    className="px-4 py-2.5 text-center text-sm text-primary font-medium hover:bg-[#F0F6FF] cursor-pointer transition-colors"
                    onClick={handleSearch}
                  >
                    See all results for "{searchTerm}"
                  </div>
                </div>
              ) : (
                <div className="px-4 py-4 text-center text-sm text-[#8B96A5]">
                  No products found for "{searchTerm}"
                  {selectedCategory && (
                    <span>
                      {" "}
                      in <b>{selectedCategory}</b>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </form>

        <div className="flex items-center gap-6">
          {/* User / Auth */}
          <div className="relative">
            {isAuthenticated ? (
              <div
                className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#0D6EFD] to-[#005ADE] rounded-full flex items-center justify-center text-white text-xs font-bold mb-0.5">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-xs truncate max-w-[60px]">
                  {user?.name?.split(" ")[0]}
                </span>
              </div>
            ) : (
              <div
                className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors"
                onClick={() => setPage("login")}
              >
                <LogIn className="w-5 h-5 mb-1" />
                <span className="text-xs">Sign In</span>
              </div>
            )}

            {/* Dropdown Menu */}
            {showUserMenu && isAuthenticated && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#DEE2E7] rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#DEE2E7] bg-[#F7FAFC]">
                    <p className="text-sm font-semibold text-[#1C1C1C] truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-[#8B96A5] truncate">
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-[#FF9017] bg-[#FF9017]/10 px-2 py-0.5 rounded-full">
                        <Shield size={10} /> Admin
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setPage("profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#505050] hover:bg-[#F7FAFC] hover:text-[#0D6EFD] transition-colors flex items-center gap-2"
                    >
                      <User size={16} /> Profile
                    </button>
                    <button
                      onClick={() => {
                        setPage("orders");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#505050] hover:bg-[#F7FAFC] hover:text-[#0D6EFD] transition-colors flex items-center gap-2"
                    >
                      <Heart size={16} /> Orders
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setPage("addProduct");
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#505050] hover:bg-[#F7FAFC] hover:text-[#0D6EFD] transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} /> Add Product
                      </button>
                    )}
                    <div className="border-t border-[#DEE2E7] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#FA3434] hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors"
            onClick={() => setPage("message")}
          >
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs">Message</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors"
            onClick={() => setPage("orders")}
          >
            <Heart className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors"
            onClick={() => setPage("cart")}
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">My cart</span>
          </div>
        </div>
      </div>

      {/* Bottom Header */}
      <div className="border-t border-shade-border bg-white overflow-x-auto lg:overflow-visible no-scrollbar">
        <div className="container py-3 flex items-center justify-between whitespace-nowrap gap-4">
          <nav className="flex items-center gap-6 font-medium text-dark">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
              onClick={() => {
                if (onSearch) onSearch("", "");
                else setPage("listing");
              }}
            >
              <Menu className="w-5 h-5" />
              <span>All category</span>
            </div>
            <a
              href="#"
              className="hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                if (onSearch) onSearch("", "");
                setPage("listing");
              }}
            >
              Hot offers
            </a>
            {/* Show first 4 categories from DB as quick links */}
            {categories.slice(0, 4).map((cat) => (
              <a
                key={cat}
                href="#"
                className="hover:text-primary transition-colors hidden xl:block"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSearch) onSearch("", cat);
                }}
              >
                {cat}
              </a>
            ))}
            {isAdmin && (
              <a
                href="#"
                className="hover:text-primary transition-colors text-[#FF9017] font-semibold flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  setPage("addProduct");
                }}
              >
                <Plus size={16} /> Add Product
              </a>
            )}
          </nav>

          <div className="flex items-center gap-6 font-medium text-dark">
            <div className="flex items-center gap-1 cursor-pointer">
              <span>English, USD</span>
              <ChevronDown className="w-4 h-4 text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
