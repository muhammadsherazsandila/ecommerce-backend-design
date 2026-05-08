import React, { useState, useEffect } from 'react';
import { ChevronRight, Grid, List, ChevronDown, Star, Heart, X, Search, Loader2 } from 'lucide-react';
import { productsAPI } from '../api';

const ProductListing = ({ setPage, setSelectedProductId, searchQuery = '', searchCategory = '' }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchCategory);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sort, setSort] = useState('-createdAt');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        sort,
      };
      if (localSearch) params.search = localSearch;
      if (selectedCategory) params.category = selectedCategory;

      const { data } = await productsAPI.getAll(params);
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    productsAPI.getCategories().then(({ data }) => {
      if (data.success) setCategories(data.categories);
    }).catch(() => {});
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1);
  }, [selectedCategory, sort, searchQuery, searchCategory]);

  // Sync from parent props
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedCategory(searchCategory);
  }, [searchCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchProducts(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setPage('details');
  };

  const renderPagination = () => {
    const { page, pages, total } = pagination;
    if (pages <= 1) return null;

    const pageNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(pages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
        <p className="text-sm text-[#8B96A5]">
          Showing {((page - 1) * pagination.limit) + 1}-{Math.min(page * pagination.limit, total)} of {total} products
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-3 py-2 border border-[#DEE2E7] rounded-lg text-sm transition-all ${
              page === 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-[#E3F0FF] hover:border-[#0D6EFD] hover:text-[#0D6EFD] cursor-pointer'
            }`}
          >
            ‹ Prev
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 border border-[#DEE2E7] rounded-lg text-sm hover:bg-[#E3F0FF] hover:border-[#0D6EFD] hover:text-[#0D6EFD] transition-all cursor-pointer"
              >
                1
              </button>
              {startPage > 2 && <span className="text-[#8B96A5] px-1">...</span>}
            </>
          )}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`px-3.5 py-2 border rounded-lg text-sm font-medium transition-all cursor-pointer ${
                num === page
                  ? 'bg-[#0D6EFD] text-white border-[#0D6EFD] shadow-md shadow-[#0D6EFD]/20'
                  : 'border-[#DEE2E7] hover:bg-[#E3F0FF] hover:border-[#0D6EFD] hover:text-[#0D6EFD]'
              }`}
            >
              {num}
            </button>
          ))}
          {endPage < pages && (
            <>
              {endPage < pages - 1 && <span className="text-[#8B96A5] px-1">...</span>}
              <button
                onClick={() => handlePageChange(pages)}
                className="px-3 py-2 border border-[#DEE2E7] rounded-lg text-sm hover:bg-[#E3F0FF] hover:border-[#0D6EFD] hover:text-[#0D6EFD] transition-all cursor-pointer"
              >
                {pages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pages}
            className={`px-3 py-2 border border-[#DEE2E7] rounded-lg text-sm transition-all ${
              page === pages
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-[#E3F0FF] hover:border-[#0D6EFD] hover:text-[#0D6EFD] cursor-pointer'
            }`}
          >
            Next ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-normal">Products</span>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-[240px] flex-shrink-0 space-y-2 hidden lg:block">
          {/* Search within results */}
          <div className="py-3">
            <form onSubmit={handleSearch} className="flex border border-[#DEE2E7] rounded-lg overflow-hidden">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
              <button type="submit" className="px-3 bg-[#F7F7F7] hover:bg-[#E3F0FF] transition-colors">
                <Search size={16} className="text-[#8B96A5]" />
              </button>
            </form>
          </div>

          {/* Category */}
          <div className="border-t border-[#DEE2E7] py-3">
            <h4 className="font-bold text-[#1C1C1C] mb-3 flex justify-between items-center cursor-pointer">
              Category <ChevronDown className="w-4 h-4 opacity-50" />
            </h4>
            <ul className="space-y-2 text-[#505050] text-sm">
              <li
                className={`cursor-pointer transition-colors ${!selectedCategory ? 'text-primary font-medium' : 'hover:text-primary'}`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </li>
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer transition-colors ${selectedCategory === cat ? 'text-primary font-medium' : 'hover:text-primary'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Sort */}
          <div className="border-t border-[#DEE2E7] py-3">
            <h4 className="font-bold text-[#1C1C1C] mb-3">Sort By</h4>
            <div className="space-y-2">
              {[
                { value: '-createdAt', label: 'Newest First' },
                { value: 'price', label: 'Price: Low to High' },
                { value: '-price', label: 'Price: High to Low' },
                { value: '-rating', label: 'Highest Rated' },
                { value: '-orders', label: 'Most Popular' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 text-[#1C1C1C] text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="sort"
                    checked={sort === opt.value}
                    onChange={() => setSort(opt.value)}
                    className="w-4 h-4 border-[#DEE2E7] text-primary focus:ring-primary"
                  />
                  <span className="group-hover:text-primary transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 flex items-center justify-between mb-4">
            <span className="text-[#1C1C1C] text-sm">
              {pagination.total} items
              {selectedCategory && <> in <span className="font-bold">{selectedCategory}</span></>}
              {localSearch && <> for "<span className="font-bold">{localSearch}</span>"</>}
            </span>
            <div className="flex items-center gap-4">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="flex lg:hidden border border-[#DEE2E7] rounded-md overflow-hidden">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-32 px-2 py-1 text-sm outline-none"
                />
                <button type="submit" className="px-2 bg-[#F7F7F7]">
                  <Search size={14} />
                </button>
              </form>
              <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden">
                <div
                  className={`p-2 border-r border-[#DEE2E7] cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} className="text-[#1C1C1C]" />
                </div>
                <div
                  className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} className="text-[#1C1C1C]" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || localSearch) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {selectedCategory && (
                <div className="flex items-center gap-2 px-3 py-1.5 border border-primary rounded-md bg-white text-dark text-sm">
                  <span>{selectedCategory}</span>
                  <X size={14} className="text-[#8B96A5] cursor-pointer hover:text-dark" onClick={() => setSelectedCategory('')} />
                </div>
              )}
              {localSearch && (
                <div className="flex items-center gap-2 px-3 py-1.5 border border-primary rounded-md bg-white text-dark text-sm">
                  <span>"{localSearch}"</span>
                  <X size={14} className="text-[#8B96A5] cursor-pointer hover:text-dark" onClick={() => { setLocalSearch(''); setTimeout(() => fetchProducts(1), 0); }} />
                </div>
              )}
              <button
                className="text-primary text-sm font-normal hover:underline ml-2"
                onClick={() => { setSelectedCategory(''); setLocalSearch(''); setTimeout(() => fetchProducts(1), 0); }}
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-[#0D6EFD] animate-spin" />
                <p className="text-[#8B96A5] text-sm">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-4">
                <Search size={40} className="text-[#DEE2E7]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">No products found</h3>
              <p className="text-[#8B96A5] text-sm mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSelectedCategory(''); setLocalSearch(''); }}
                className="text-primary font-medium text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* Product List View */
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product._id} className="bg-white border border-[#DEE2E7] rounded-lg p-5 flex gap-6 hover:shadow-md transition-shadow group cursor-pointer relative" onClick={() => handleProductClick(product._id)}>
                  {/* Product Image area */}
                  <div className="w-[180px] h-[180px] lg:w-[210px] lg:h-[210px] flex-shrink-0 flex items-center justify-center bg-[#F7F7F7] rounded-lg p-4 relative overflow-hidden">
                    <img
                      src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
                    />
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute right-5 top-5 w-10 h-10 border border-[#DEE2E7] rounded-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" onClick={(e) => e.stopPropagation()}>
                    <Heart size={20} />
                  </button>

                  {/* Product Info */}
                  <div className="flex-1 py-1">
                    <h3 className="text-[#1C1C1C] text-base font-semibold group-hover:text-primary transition-colors mb-2">{product.name}</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#1C1C1C]">${product.price.toFixed(2)}</span>
                        {product.oldPrice && <span className="text-[#8B96A5] line-through text-sm mt-0.5">${product.oldPrice.toFixed(2)}</span>}
                      </div>
                    </div>

                    {/* Rating Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                        ))}
                      </div>
                      <span className="text-[#FF9017] text-sm font-medium">{product.rating.toFixed(1)}</span>
                      <span className="text-[#8B96A5] text-sm ml-2">• {product.orders} orders</span>
                      <span className="text-[#00B517] text-sm font-medium ml-2">• {product.shipping}</span>
                    </div>

                    <p className="text-[#505050] text-sm leading-relaxed mb-3 line-clamp-2 max-w-2xl">
                      {product.description}
                    </p>

                    <button className="text-primary font-bold text-sm bg-transparent border-none p-0 hover:underline">
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Product Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-[#DEE2E7] rounded-lg p-4 hover:shadow-[0px_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Product Image Area */}
                  <div className="w-full aspect-square flex items-center justify-center mb-4 bg-[#F7F7F7] rounded-md p-6 overflow-hidden relative">
                    <img
                      src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                      alt={product.name}
                      className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
                    />
                    {product.featured && (
                      <span className="absolute top-2 left-2 bg-[#FF9017] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Product Info Area */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#1C1C1C]">${product.price.toFixed(2)}</span>
                          <button className="w-8 h-8 border border-[#DEE2E7] rounded-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" onClick={(e) => e.stopPropagation()}>
                            <Heart size={16} />
                          </button>
                        </div>
                        {product.oldPrice && <span className="text-[#8B96A5] line-through text-xs">${product.oldPrice.toFixed(2)}</span>}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex gap-0.5">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} size={12} className={i < Math.round(product.rating) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                        ))}
                      </div>
                      <span className="text-[#FF9017] text-xs font-medium">{product.rating.toFixed(1)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[#505050] text-[13px] leading-[1.4] line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Stock info */}
                    <p className={`text-xs mt-2 font-medium ${product.stock > 0 ? 'text-[#00B517]' : 'text-[#FA3434]'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && renderPagination()}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
