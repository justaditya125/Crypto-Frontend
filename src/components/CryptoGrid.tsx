
import { motion } from 'framer-motion';
import { CryptoCard } from './CryptoCard';
import { LoadingSpinner } from './LoadingSpinner';

interface CryptoGridProps {
  cryptoData: any[];
  loading: boolean;
  currency: string;
  portfolio: any[];
  onAddToPortfolio: (crypto: any) => void;
  onSelectCrypto: (id: string) => void;
  selectedCrypto: string;
}

export const CryptoGrid = ({ 
  cryptoData, 
  loading, 
  currency, 
  portfolio, 
  onAddToPortfolio, 
  onSelectCrypto,
  selectedCrypto 
}: CryptoGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Add safety check for cryptoData
  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-400">No cryptocurrency data available</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {cryptoData.map((crypto, index) => {
        // Add safety check for each crypto item
        if (!crypto || !crypto.id) {
          return null;
        }

        return (
          <motion.div
            key={crypto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
          >
            <CryptoCard
              crypto={crypto}
              currency={currency}
              isInPortfolio={portfolio.some(p => p.id === crypto.id)}
              isSelected={selectedCrypto === crypto.id}
              onAddToPortfolio={() => onAddToPortfolio(crypto)}
              onSelect={() => onSelectCrypto(crypto.id)}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};
