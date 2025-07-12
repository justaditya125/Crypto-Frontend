
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Check, Star } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface PopularCryptosProps {
  cryptoData: any[];
  loading: boolean;
  currency: string;
  portfolio: any[];
  onAddToPortfolio: (crypto: any) => void;
  onSelectCrypto: (id: string) => void;
  selectedCrypto: string;
}

export const PopularCryptos = ({
  cryptoData,
  loading,
  currency,
  portfolio,
  onAddToPortfolio,
  onSelectCrypto,
  selectedCrypto
}: PopularCryptosProps) => {
  const topCryptos = cryptoData.slice(0, 12); // Show top 12 cryptocurrencies

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Popular Cryptocurrencies</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-700/50 rounded-lg p-4 h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Popular Cryptocurrencies</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
        {topCryptos.map((crypto, index) => {
          if (!crypto?.id) return null;

          const priceChange = crypto.price_change_percentage_24h || 0;
          const isPositive = priceChange >= 0;
          const isInPortfolio = portfolio.some(p => p.id === crypto.id);
          const isSelected = selectedCrypto === crypto.id;

          return (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700/70 cursor-pointer transition-all duration-300 ${
                isSelected ? 'border-purple-500/50 bg-purple-600/10' : ''
              }`}
              onClick={() => onSelectCrypto(crypto.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={crypto.image || '/placeholder.svg'}
                      alt={crypto.name || 'Cryptocurrency'}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute -top-1 -left-1 text-xs bg-slate-800 text-slate-400 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{crypto.name || 'Unknown'}</h3>
                    <p className="text-slate-400 text-xs uppercase">{crypto.symbol || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-white text-sm">
                      {formatCurrency(crypto.current_price || 0, currency)}
                    </p>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {formatPercentage(Math.abs(priceChange))}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToPortfolio(crypto);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isInPortfolio
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                  >
                    {isInPortfolio ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {topCryptos.length === 0 && (
        <div className="text-center text-slate-400 py-8">
          <p>No cryptocurrency data available</p>
        </div>
      )}
    </div>
  );
};
