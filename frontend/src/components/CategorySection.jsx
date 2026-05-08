import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { productsAPI } from '../api';

const CategorySection = ({ title, bannerImg, bannerBg, category, preloadedProducts, loading: parentLoading, setPage, setSelectedProductId, onSearch }) => {
  const [items, setItems] = useState(preloadedProducts || []);
  const [loading, setLoading] = useState(!preloadedProducts);

  // Use preloaded data when it arrives
  useEffect(() => {
    if (preloadedProducts) {
      setItems(preloadedProducts);
      setLoading(false);
    }
  }, [preloadedProducts]);

  // Fallback: fetch only if no preloaded data and category is provided
  useEffect(() => {
    if (preloadedProducts || !category) return;
    const fetchProducts = async () => {
      try {
        const { data } = await productsAPI.getAll({ category, limit: 8 });
        if (data.success) {
          setItems(data.products);
        }
      } catch (error) {
        console.error(`Failed to fetch ${category} products:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, preloadedProducts]);

  const handleClick = (productId) => {
    if (setSelectedProductId) setSelectedProductId(productId);
    if (setPage) setPage('details');
  };

  if (loading || parentLoading) {
    return (
      <section className="bg-white border border-[#DEE2E7] rounded-lg mt-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#0D6EFD] animate-spin" />
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="bg-white border border-[#DEE2E7] rounded-lg mt-6 flex flex-col lg:flex-row overflow-hidden">
      {/* Banner */}
      <div
        className="w-72 p-6 flex flex-col justify-start relative overflow-hidden bg-cover bg-no-repeat"
        style={{ backgroundColor: bannerBg || '#F7F7F7', backgroundImage: bannerImg ? `url("${bannerImg}")` : 'none' }}
      >
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-dark w-40 leading-tight mb-4">{title}</h3>
          <button
            className="bg-white text-dark px-4 py-2 rounded-md font-medium text-sm hover:bg-shade transition-colors shadow-sm"
            onClick={() => {
              if (onSearch) onSearch('', title);
              else if (setPage) setPage('listing');
            }}
          >
            Source now
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="p-5 border-r border-b last:border-r-0 border-[#DEE2E7] flex justify-between cursor-pointer hover:bg-white hover:shadow-[0px_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 group h-[130px] relative hover:z-10"
            onClick={() => handleClick(item._id)}
          >
            <div className="flex flex-col">
              <span className="text-[#1C1C1C] text-sm font-medium group-hover:text-primary transition-colors mb-1">{item.name}</span>
              <span className="text-[#8B96A5] text-xs">From <br /> USD {item.price.toFixed(2)}</span>
            </div>
            <div className="w-[82px] h-[82px] self-end -mr-1 -mb-1">
              <img
                src={item.image || 'https://via.placeholder.com/82x82?text=No+Image'}
                alt={item.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/82x82?text=No+Image'; }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
