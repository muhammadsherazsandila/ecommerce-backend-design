import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Deals from './components/Deals';
import CategorySection from './components/CategorySection';
import InquiryForm from './components/InquiryForm';
import RecommendedItems from './components/RecommendedItems';
import Services from './components/Services';
import RegionSuppliers from './components/RegionSuppliers';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Orders from './components/Orders';
import Login from './components/Login';
import Signup from './components/Signup';
import AddProduct from './components/AddProduct';
import { productsAPI } from './api';

// Color palette for category section banners
const BANNER_COLORS = ['#FFE6BF', '#E5F1FF', '#DCFCE7', '#FDE8E8', '#F3E8FF', '#FEF3C7'];

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [homepageData, setHomepageData] = useState(null);
  const [homepageLoading, setHomepageLoading] = useState(true);
  const { isAdmin } = useAuth();

  // Single API call for all homepage data
  useEffect(() => {
    productsAPI.getHomepage().then(({ data }) => {
      if (data.success) setHomepageData(data);
    }).catch(() => { }).finally(() => setHomepageLoading(false));
  }, []);

  const handleSearch = useCallback((query, category = '') => {
    setSearchQuery(query);
    setSearchCategory(category);
    setCurrentPage('listing');
  }, []);

  const handleSetPage = useCallback((page) => {
    // Protect admin-only pages
    if (page === 'addProduct' && !isAdmin) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  }, [isAdmin]);

  const renderContent = () => {
    switch (currentPage) {
      case 'listing':
        return (
          <ProductListing
            setPage={handleSetPage}
            setSelectedProductId={setSelectedProductId}
            searchQuery={searchQuery}
            searchCategory={searchCategory}
          />
        );
      case 'details':
        return (
          <ProductDetails
            setPage={handleSetPage}
            productId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
          />
        );
      case 'cart':
        return <Cart setPage={handleSetPage} />;
      case 'profile':
        return <Profile setPage={handleSetPage} />;
      case 'message':
        return <Messages setPage={handleSetPage} />;
      case 'orders':
        return <Orders setPage={handleSetPage} />;
      case 'login':
        return <Login setPage={handleSetPage} />;
      case 'signup':
        return <Signup setPage={handleSetPage} />;
      case 'addProduct':
        return <AddProduct setPage={handleSetPage} />;
      default:
        return (
          <div className="container">
            <Hero setPage={handleSetPage} onSearch={handleSearch} categories={homepageData?.categories} />
            <Deals
              setPage={handleSetPage}
              setSelectedProductId={setSelectedProductId}
              preloadedDeals={homepageData?.featured}
              loading={homepageLoading}
            />

            {homepageData?.categorySections?.map((section, i) => (
              <CategorySection
                key={section.category}
                title={section.category}
                bannerBg={BANNER_COLORS[i % BANNER_COLORS.length]}
                preloadedProducts={section.products}
                loading={homepageLoading}
                setPage={handleSetPage}
                setSelectedProductId={setSelectedProductId}
                onSearch={handleSearch}
              />
            ))}

            <InquiryForm />
            <RecommendedItems
              setPage={handleSetPage}
              setSelectedProductId={setSelectedProductId}
              preloadedProducts={homepageData?.recommended}
              loading={homepageLoading}
            />
            <Services />
            <RegionSuppliers />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header setPage={handleSetPage} onSearch={handleSearch} />

      <main className="flex-grow pb-12">
        {renderContent()}
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
