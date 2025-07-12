import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Edit, Trash2, Wallet } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { WalletConnect } from './WalletConnect';
import { WalletPortfolio } from './WalletPortfolio';

interface PortfolioProps {
  portfolio: any[];
  cryptoData: any[];
  currency: string;
  onUpdateHolding: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  onAddToPortfolio: (crypto: any) => void;
  expanded?: boolean;
  loading?: boolean;
  error?: string | null;
}

export const Portfolio = ({ 
  portfolio, 
  cryptoData, 
  currency, 
  onUpdateHolding, 
  onRemove,
  onAddToPortfolio,
  expanded = false,
  loading = false,
  error = null
}: PortfolioProps) => {
  const [showWalletImport, setShowWalletImport] = useState(false);

  const portfolioValue = portfolio.reduce((total, holding) => {
    const crypto = cryptoData.find(c => c.id === holding.coin_id);
    return total + (crypto ? crypto.current_price * holding.amount : 0);
  }, 0);

  const portfolioChange = portfolio.reduce((total, holding) => {
    const crypto = cryptoData.find(c => c.id === holding.coin_id);
    if (!crypto) return total;
    const holdingValue = crypto.current_price * holding.amount;
    const holdingChange = (crypto.price_change_percentage_24h || 0) / 100;
    return total + (holdingValue * holdingChange);
  }, 0);

  const portfolioChangePercent = portfolioValue > 0 ? (portfolioChange / portfolioValue) * 100 : 0;
  const isPositive = portfolioChangePercent >= 0;

  const handleImportFromWallet = (crypto: any, amount: number) => {
    // Add the crypto with the specified amount
    const cryptoWithAmount = { ...crypto, amount };
    onAddToPortfolio(cryptoWithAmount);
  };

  return (
    <motion.div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 ${
        expanded ? 'w-full' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Portfolio</h3>
        <div className="flex items-center gap-3">
          <motion.div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
              isPositive ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
            }`}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {formatPercentage(Math.abs(portfolioChangePercent))}
          </motion.div>
          <button
            onClick={() => setShowWalletImport(!showWalletImport)}
            className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
          >
            <Wallet className="h-4 w-4" />
            Wallet
          </button>
        </div>
      </div>

      {showWalletImport && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600"
        >
          <div className="mb-4">
            <WalletConnect />
          </div>
          <WalletPortfolio onImportHolding={handleImportFromWallet} />
        </motion.div>
      )}

      <div className="mb-6">
        <motion.div
          className="text-3xl font-bold text-white mb-2"
          key={portfolioValue}
          initial={{ scale: 1.1, color: '#8b5cf6' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.3 }}
        >
          {formatCurrency(portfolioValue, currency)}
        </motion.div>
        <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{formatCurrency(portfolioChange, currency)} today
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {portfolio.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No holdings yet. Add cryptocurrencies to your portfolio to get started.
            </p>
          ) : (
            portfolio.map((holding) => {
              const crypto = cryptoData.find(c => c.id === holding.coin_id);
              if (!crypto) return null;

              const holdingValue = crypto.current_price * holding.amount;
              const holdingChange = (crypto.price_change_percentage_24h || 0);
              const isHoldingPositive = holdingChange >= 0;

              return (
                <motion.div
                  key={holding._id?.toString() || holding.coin_id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                  whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.7)' }}
                  layout
                >
                  <div className="flex items-center gap-3">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-medium text-white">{crypto.name}</p>
                      <p className="text-sm text-slate-400">{holding.amount} {crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(holdingValue, currency)}</p>
                    <div className={`text-sm flex items-center gap-1 ${
                      isHoldingPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isHoldingPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {formatPercentage(Math.abs(holdingChange))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newAmount = prompt('Enter new amount:', holding.amount.toString());
                        if (newAmount && !isNaN(Number(newAmount))) {
                          onUpdateHolding(holding._id?.toString() || '', Number(newAmount));
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemove(holding._id?.toString() || '')}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
};
