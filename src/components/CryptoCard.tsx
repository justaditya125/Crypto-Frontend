
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Check } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface CryptoCardProps {
  crypto: any;
  currency: string;
  isInPortfolio: boolean;
  isSelected: boolean;
  onAddToPortfolio: () => void;
  onSelect: () => void;
}

export const CryptoCard = ({ 
  crypto, 
  currency, 
  isInPortfolio, 
  isSelected,
  onAddToPortfolio, 
  onSelect 
}: CryptoCardProps) => {
  // Add safety checks for crypto data
  if (!crypto) {
    return null;
  }

  const priceChange = crypto.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  const currentPrice = crypto.current_price || 0;
  const marketCap = crypto.market_cap || 0;
  const volume = crypto.total_volume || 0;

  return (
    <motion.div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
          : 'border-slate-700 hover:border-slate-600'
      }`}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.img
            src={crypto.image || '/placeholder.svg'}
            alt={crypto.name || 'Cryptocurrency'}
            className="w-10 h-10 rounded-full"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div>
            <h3 className="font-semibold text-white">{crypto.name || 'Unknown'}</h3>
            <p className="text-slate-400 text-sm uppercase">{crypto.symbol || 'N/A'}</p>
          </div>
        </div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPortfolio();
          }}
          className={`p-2 rounded-lg transition-colors ${
            isInPortfolio
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isInPortfolio ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </motion.button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {formatCurrency(currentPrice, currency)}
          </span>
          <motion.div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
              isPositive 
                ? 'bg-green-600/20 text-green-400' 
                : 'bg-red-600/20 text-red-400'
            }`}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercentage(Math.abs(priceChange))}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Market Cap</p>
            <p className="text-white font-medium">
              {formatCurrency(marketCap, currency, true)}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Volume 24h</p>
            <p className="text-white font-medium">
              {formatCurrency(volume, currency, true)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
