import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { productsAPI } from '../api';

const Deals = ({ setPage, setSelectedProductId, preloadedDeals, loading: parentLoading }) => {
  const [deals, setDeals] = useState(preloadedDeals || []);
  const [loading, setLoading] = useState(!preloadedDeals);
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 13, mins: 34, secs: 56 });

  // Use preloaded data when it arrives
  useEffect(() => {
    if (preloadedDeals) {
      setDeals(preloadedDeals.slice(0, 5));
      setLoading(false);
    }
  }, [preloadedDeals]);

  // Fallback: fetch only if no preloaded data
  useEffect(() => {
    if (preloadedDeals) return;
    const fetchDeals = async () => {
      try {
        const { data } = await productsAPI.getFeatured(5);
        if (data.success) {
          setDeals(data.products.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [preloadedDeals]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; mins = 0; secs = 0; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (productId) => {
    if (setSelectedProductId) setSelectedProductId(productId);
    setPage('details');
  };

  const getDiscount = (product) => {
    if (product.oldPrice && product.oldPrice > product.price) {
      return `-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%`;
    }
    return '-25%';
  };

  if (loading || parentLoading) {
    return (
      <section className="bg-white border border-[#DEE2E7] rounded-lg mt-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#0D6EFD] animate-spin" />
      </section>
    );
  }

  if (deals.length === 0) return null;

  return (
    <section className="bg-white border border-[#DEE2E7] rounded-lg mt-6 flex overflow-hidden">
      {/* Timer Section */}
      <div className="w-72 p-6 border-r border-[#DEE2E7] flex flex-col justify-center flex-shrink-0">
        <h3 className="text-xl font-bold text-dark mb-1">Deals and offers</h3>
        <p className="text-secondary mb-4 font-normal">Featured products</p>
        <div className="flex gap-2">
          {[
            { val: String(timeLeft.days).padStart(2, '0'), label: 'Days' },
            { val: String(timeLeft.hours).padStart(2, '0'), label: 'Hour' },
            { val: String(timeLeft.mins).padStart(2, '0'), label: 'Min' },
            { val: String(timeLeft.secs).padStart(2, '0'), label: 'Sec' },
          ].map((t, i) => (
            <div key={i} className="w-12 h-12 bg-[#606060] rounded flex flex-col items-center justify-center text-white">
              <span className="text-sm font-bold">{t.val}</span>
              <span className="text-[10px] opacity-70">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 h-full">
        {deals.map((deal) => (
          <div
            key={deal._id}
            className="p-6 flex flex-col items-center justify-center text-center border-r border-b lg:border-b-0 last:border-r-0 border-[#DEE2E7] cursor-pointer hover:shadow-[0px_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group"
            onClick={() => handleClick(deal._id)}
          >
            <div className="w-full aspect-square bg-[#F7F7F7] rounded-md flex items-center justify-center mb-4 overflow-hidden p-2">
              <img
                src={deal.image || 'https://via.placeholder.com/120x120?text=No+Image'}
                alt={deal.name}
                className="max-w-[90%] max-h-[90%] object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/120x120?text=No+Image'; }}
              />
            </div>
            <p className="text-[#1C1C1C] text-sm mb-2 line-clamp-1">{deal.name}</p>
            <span className="bg-[#FFE3E3] text-[#EB001B] px-3 py-1 rounded-full text-xs font-bold">
              {getDiscount(deal)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Deals;
