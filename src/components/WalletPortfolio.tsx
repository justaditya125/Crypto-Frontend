
import { motion } from 'framer-motion';
import { Import, RefreshCw } from 'lucide-react';
import { useWalletPortfolio } from '@/hooks/useWalletPortfolio';
import { useWallet } from '@/hooks/useWallet';
import { formatCurrency } from '@/utils/formatters';

interface WalletPortfolioProps {
  onImportHolding: (crypto: any, amount: number) => void;
}

export const WalletPortfolio = ({ onImportHolding }: WalletPortfolioProps) => {
  const { wallet } = useWallet();
  const { holdings, loading, error, importToPortfolio, refetch } = useWalletPortfolio();

  if (!wallet.isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 mb-2">Connect your wallet to view holdings</p>
        <p className="text-sm text-slate-500">
          Your cryptocurrency holdings will appear here once connected
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
        <p className="text-slate-400">Loading wallet holdings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-2">{error}</p>
        <button
          onClick={refetch}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Wallet Holdings</h3>
          <p className="text-sm text-slate-400">
            Total Value: {formatCurrency(totalValue, 'usd')}
          </p>
        </div>
        <button
          onClick={refetch}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        {holdings.length === 0 ? (
          <p className="text-slate-400 text-center py-4">
            No holdings found in connected wallet
          </p>
        ) : (
          holdings.map((holding) => (
            <motion.div
              key={holding.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
              whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.7)' }}
            >
              <div className="flex items-center gap-3">
                {holding.image && (
                  <img 
                    src={holding.image} 
                    alt={holding.name} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-white">{holding.name}</p>
                  <p className="text-sm text-slate-400">
                    {holding.balance.toFixed(4)} {holding.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-white">
                  {formatCurrency(holding.value, 'usd')}
                </p>
                <p className="text-sm text-slate-400">
                  ${(holding.value / holding.balance).toFixed(2)} per token
                </p>
              </div>

              <button
                onClick={() => {
                  const { crypto, amount } = importToPortfolio(holding);
                  onImportHolding(crypto, amount);
                }}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                title="Import to Portfolio"
              >
                <Import className="h-4 w-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
