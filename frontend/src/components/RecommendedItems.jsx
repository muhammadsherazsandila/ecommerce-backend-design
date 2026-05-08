import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { productsAPI } from '../api';

const RecommendedItems = ({ setPage, setSelectedProductId, preloadedProducts, loading: parentLoading }) => {
  const [products, setProducts] = useState(preloadedProducts || []);
  const [loading, setLoading] = useState(!preloadedProducts);

  // Use preloaded data when it arrives
  useEffect(() => {
    if (preloadedProducts) {
      setProducts(preloadedProducts);
      setLoading(false);
    }
  }, [preloadedProducts]);

  // Fallback: fetch only if no preloaded data
  useEffect(() => {
    if (preloadedProducts) return;
    const fetchProducts = async () => {
      try {
        const { data } = await productsAPI.getAll({ limit: 10, sort: '-orders' });
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch recommended products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [preloadedProducts]);

  const handleClick = (productId) => {
    if (setSelectedProductId) setSelectedProductId(productId);
    setPage('details');
  };

  if (loading || parentLoading) {
    return (
      <section className="mt-8">
        <h3 className="text-2xl font-bold mb-6">Recommended items</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#0D6EFD] animate-spin" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Recommended items</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-[#DEE2E7] rounded-lg p-4 flex flex-col hover:shadow-[0px_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group h-full"
            onClick={() => handleClick(item._id)}
          >
            <div className="flex-1 flex items-center justify-center p-4 mb-3">
              <img
                src={item.image || 'https://via.placeholder.com/140x140?text=No+Image'}
                alt={item.name}
                className="max-h-[140px] w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/140x140?text=No+Image'; }}
              />
            </div>
            <div className="mt-auto">
              <p className="font-medium text-[#1C1C1C] text-lg mb-1">${item.price.toFixed(2)}</p>
              <p className="text-[#8B96A5] text-[15px] overflow-hidden text-ellipsis line-clamp-2 leading-snug">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedItems;
