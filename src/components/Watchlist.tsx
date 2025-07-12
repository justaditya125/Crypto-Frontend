
import { motion } from 'framer-motion';
import { Star, StarOff, TrendingUp, TrendingDown } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface WatchlistProps {
  cryptoData: any[];
  currency: string;
  onSelectCrypto: (id: string) => void;
}

export const Watchlist = ({ cryptoData, currency, onSelectCrypto }: WatchlistProps) => {
  const [watchlist, setWatchlist] = useLocalStorage<string[]>('watchlist', []);

  const toggleWatchlist = (cryptoId: string) => {
    setWatchlist(prev => 
      prev.includes(cryptoId) 
        ? prev.filter(id => id !== cryptoId)
        : [...prev, cryptoId]
    );
  };

  const watchedCryptos = cryptoData.filter(crypto => watchlist.includes(crypto.id));

  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold text-white mb-6">Watchlist</h3>

      {watchedCryptos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">Your watchlist is empty</p>
          <p className="text-sm text-slate-500">Click the star icon on any cryptocurrency to add it to your watchlist</p>
        </div>
      ) : (
        <div className="space-y-4">
          {watchedCryptos.map(crypto => {
            const priceChange = crypto.price_change_percentage_24h || 0;
            const isPositive = priceChange >= 0;

            return (
              <motion.div
                key={crypto.id}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700/70 transition-colors"
                onClick={() => onSelectCrypto(crypto.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <img src={crypto.image} alt={crypto.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-medium text-white">{crypto.name}</h4>
                    <p className="text-sm text-slate-400 uppercase">{crypto.symbol}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(crypto.current_price, currency)}</p>
                  <div className={`text-sm flex items-center gap-1 justify-end ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatPercentage(Math.abs(priceChange))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlist(crypto.id);
                  }}
                  className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-lg font-medium text-white mb-4">Add to Watchlist</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cryptoData.slice(0, 9).map(crypto => (
            <button
              key={crypto.id}
              onClick={() => toggleWatchlist(crypto.id)}
              className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                watchlist.includes(crypto.id)
                  ? 'bg-yellow-600/20 text-yellow-400'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <img src={crypto.image} alt={crypto.name} className="w-6 h-6 rounded-full" />
              <span className="text-sm font-medium">{crypto.symbol.toUpperCase()}</span>
              {watchlist.includes(crypto.id) ? (
                <Star className="h-4 w-4 fill-current ml-auto" />
              ) : (
                <StarOff className="h-4 w-4 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
