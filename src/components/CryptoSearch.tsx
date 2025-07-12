
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Plus, Check } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface CryptoSearchProps {
  cryptoData: any[];
  loading: boolean;
  currency: string;
  portfolio: any[];
  onAddToPortfolio: (crypto: any) => void;
  onSelectCrypto: (id: string) => void;
  selectedCrypto: string;
}

export const CryptoSearch = ({
  cryptoData,
  loading,
  currency,
  portfolio,
  onAddToPortfolio,
  onSelectCrypto,
  selectedCrypto
}: CryptoSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0 && cryptoData.length > 0) {
      const filtered = cryptoData.filter(crypto =>
        crypto?.name?.toLowerCase().includes(term.toLowerCase()) ||
        crypto?.symbol?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered.slice(0, 10)); // Limit to top 10 results
      setShowResults(true);
    } else {
      setFilteredData([]);
      setShowResults(false);
    }
  };

  const handleSelectCrypto = (crypto: any) => {
    onSelectCrypto(crypto.id);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl max-h-96 overflow-y-auto z-50"
        >
          {filteredData.length > 0 ? (
            filteredData.map((crypto) => {
              if (!crypto?.id) return null;

              const priceChange = crypto.price_change_percentage_24h || 0;
              const isPositive = priceChange >= 0;
              const isInPortfolio = portfolio.some(p => p.id === crypto.id);
              const isSelected = selectedCrypto === crypto.id;

              return (
                <div
                  key={crypto.id}
                  className={`p-4 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-purple-600/20 border-purple-500/50' : ''
                  }`}
                  onClick={() => handleSelectCrypto(crypto)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image || '/placeholder.svg'}
                        alt={crypto.name || 'Cryptocurrency'}
                        className="w-10 h-10 rounded-full"
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
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-white">
                          {formatCurrency(crypto.current_price || 0, currency)}
                        </p>
                        <div
                          className={`flex items-center gap-1 text-sm ${
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
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {isInPortfolio ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-slate-400">
              No cryptocurrencies found matching "{searchTerm}"
            </div>
          )}
        </motion.div>
      )}

      {searchTerm.length === 0 && (
        <div className="mt-6 text-center">
          <div className="text-slate-400 mb-2">
            Start typing to search for cryptocurrencies
          </div>
          <div className="text-sm text-slate-500">
            Search by name or symbol (e.g., Bitcoin, BTC)
          </div>
        </div>
      )}
    </div>
  );
};
