import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api';
import bannerImg from '../assets/Image/backgrounds/Banner-board-800x420 2.png';
import promo1 from '../assets/Image/backgrounds/Group 969.png';
import promo2 from '../assets/Image/backgrounds/Group 982.png';

const Hero = ({ setPage, onSearch, categories: preloadedCategories }) => {
  const { isAuthenticated, user } = useAuth();
  const [categories, setCategories] = useState(preloadedCategories || []);
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(!preloadedCategories);

  // Fetch categories from DB if not preloaded
  useEffect(() => {
    if (preloadedCategories && preloadedCategories.length > 0) {
      setCategories(preloadedCategories);
      setLoading(false);
      return;
    }
    productsAPI.getCategories().then(({ data }) => {
      if (data.success) setCategories(data.categories);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [preloadedCategories]);

  const handleCategoryClick = (cat, index) => {
    setActiveCategory(index);
    if (onSearch) onSearch('', cat);
  };

  return (
    <section className="bg-white border border-shade-border rounded-lg mt-6 overflow-hidden">
      <div className="flex p-4 gap-4 h-[400px]">
        {/* Left Categories – from database */}
        <div className="w-64 flex-shrink-0 overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-[#0D6EFD] animate-spin" />
            </div>
          ) : (
            <ul className="space-y-0.5">
              {categories.map((cat, index) => (
                <li
                  key={cat}
                  className={`px-4 py-2 rounded-md cursor-pointer transition-all text-sm flex items-center justify-between group ${
                    index === activeCategory
                      ? 'bg-primary-light font-medium text-dark'
                      : 'text-dark-light hover:bg-shade hover:text-dark'
                  }`}
                  onClick={() => handleCategoryClick(cat, index)}
                >
                  <span>{cat}</span>
                  <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${index === activeCategory ? 'opacity-100' : ''}`} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Banner */}
        <div
          className="flex-1 relative rounded-lg p-10 flex flex-col justify-center bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url("${bannerImg}")` }}
        >
           <div className="relative z-10 w-1/2">
             <h3 className="text-2xl font-normal text-dark mb-1">Latest trending</h3>
             <h2 className="text-[32px] font-bold text-dark leading-tight mb-6">Electronic items</h2>
             <button
               className="bg-white text-dark px-6 py-2 rounded-md font-medium hover:bg-shade transition-colors shadow-sm"
               onClick={() => onSearch && onSearch('', 'Electronics')}
             >
               Learn more
             </button>
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-60 flex flex-col gap-3">
          {/* Welcome / User Box */}
          <div className="bg-[#E3F0FF] p-4 rounded-lg">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D6EFD] to-[#005ADE] flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-dark text-sm font-medium">Hi, {user?.name?.split(' ')[0]}</p>
                    <p className="text-dark-light text-xs">Welcome back!</p>
                  </div>
                </div>
                <button
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md mb-2 text-sm font-medium transition-colors"
                  onClick={() => setPage && setPage('profile')}
                >
                  My Profile
                </button>
                <button
                  className="w-full bg-white text-primary py-2 rounded-md text-sm font-medium border border-shade-border hover:bg-shade transition-colors"
                  onClick={() => setPage && setPage('orders')}
                >
                  My Orders
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#C3D9FF] flex items-center justify-center text-secondary">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-dark text-sm">Hi, user</p>
                    <p className="text-dark text-sm">let's get started</p>
                  </div>
                </div>
                <button
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md mb-2 text-sm font-medium transition-colors"
                  onClick={() => setPage && setPage('signup')}
                >
                  Join now
                </button>
                <button
                  className="w-full bg-white text-primary py-2 rounded-md text-sm font-medium border border-shade-border hover:bg-shade transition-colors"
                  onClick={() => setPage && setPage('login')}
                >
                  Log in
                </button>
              </>
            )}
          </div>

          {/* Promo 1 */}
          <div
            className="bg-orange p-3 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundImage: `url("${promo1}")` }}
            onClick={() => onSearch && onSearch('', '')}
          >
            <p className="text-sm font-normal leading-tight w-2/3">Get US $10 off with a new supplier</p>
          </div>

          {/* Promo 2 */}
          <div
            className="bg-teal p-3 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundImage: `url("${promo2}")` }}
            onClick={() => setPage && setPage('listing')}
          >
            <p className="text-sm font-normal leading-tight w-2/3">Send quotes with supplier preferences</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
