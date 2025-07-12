
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { CryptoHeader } from '@/components/CryptoHeader';
import { CryptoSearch } from '@/components/CryptoSearch';
import { Portfolio } from '@/components/Portfolio';
import { Watchlist } from '@/components/Watchlist';
import { Alerts } from '@/components/Alerts';
import { CurrencySelector } from '@/components/CurrencySelector';
import { PopularCryptos } from '@/components/PopularCryptos';
import { AddToPortfolioModal } from '@/components/AddToPortfolioModal';
import { useCryptoData } from '@/hooks/useCryptoData';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [currency, setCurrency] = useLocalStorage('currency', 'usd');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { cryptoData, loading, error } = useCryptoData(currency);
  const { 
    portfolio, 
    addToPortfolio, 
    removeFromPortfolio, 
    updateHolding, 
    loading: portfolioLoading, 
    error: portfolioError,
    modalState,
    handleAddToPortfolioConfirm,
    closeModal
  } = usePortfolio();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  // Don't redirect unauthenticated users - let them view the page but show login message when they try to add crypto

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex flex-col">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col h-full"
      >
        <motion.div variants={itemVariants} className="px-4 py-6">
          <CryptoHeader />
        </motion.div>

        <motion.div variants={itemVariants} className="px-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {['dashboard', 'portfolio', 'watchlist', 'alerts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <CurrencySelector currency={currency} onCurrencyChange={setCurrency} />
          </div>
        </motion.div>

        <div className="flex-1 overflow-hidden px-4 pb-6">
          {activeTab === 'dashboard' && (
            <motion.div variants={itemVariants} className="h-full">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                <div className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 overflow-hidden flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-4">Popular Cryptocurrencies</h2>
                  <div className="flex-1 overflow-y-auto">
                    <PopularCryptos 
                      cryptoData={cryptoData}
                      loading={loading}
                      currency={currency}
                      portfolio={portfolio}
                      onAddToPortfolio={addToPortfolio}
                      onSelectCrypto={setSelectedCrypto}
                      selectedCrypto={selectedCrypto}
                    />
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 overflow-hidden flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-4">Search Cryptocurrencies</h2>
                  <div className="flex-1 overflow-y-auto">
                    <CryptoSearch 
                      cryptoData={cryptoData}
                      loading={loading}
                      currency={currency}
                      portfolio={portfolio}
                      onAddToPortfolio={addToPortfolio}
                      onSelectCrypto={setSelectedCrypto}
                      selectedCrypto={selectedCrypto}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div variants={itemVariants} className="h-full">
              <Portfolio 
                portfolio={portfolio}
                cryptoData={cryptoData}
                currency={currency}
                onUpdateHolding={updateHolding}
                onRemove={removeFromPortfolio}
                onAddToPortfolio={addToPortfolio}
                expanded={true}
                loading={portfolioLoading}
                error={portfolioError}
              />
            </motion.div>
          )}

          {activeTab === 'watchlist' && (
            <motion.div variants={itemVariants} className="h-full">
              <Watchlist 
                cryptoData={cryptoData}
                currency={currency}
                onSelectCrypto={setSelectedCrypto}
              />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div variants={itemVariants} className="h-full">
              <Alerts 
                cryptoData={cryptoData}
                currency={currency}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Add to Portfolio Modal */}
      <AddToPortfolioModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleAddToPortfolioConfirm}
        crypto={modalState.crypto}
        currency={currency}
      />
    </div>
  );
};

export default Index;
