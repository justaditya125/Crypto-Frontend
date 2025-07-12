
import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';

interface WalletHolding {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  value: number;
  image?: string;
}

export const useWalletPortfolio = () => {
  const { wallet } = useWallet();
  const [holdings, setHoldings] = useState<WalletHolding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      fetchWalletHoldings();
    } else {
      setHoldings([]);
    }
  }, [wallet.isConnected, wallet.address]);

  const fetchWalletHoldings = async () => {
    if (!wallet.address) return;

    setLoading(true);
    setError(null);

    try {
      // For demonstration, we'll fetch ETH balance and some mock ERC-20 tokens
      // In a real implementation, you'd use services like Moralis, Alchemy, or similar
      const ethBalance = parseFloat(wallet.balance || '0');
      
      // Mock some common ERC-20 tokens (in a real app, you'd fetch these from blockchain APIs)
      const mockHoldings: WalletHolding[] = [
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance,
          value: ethBalance * 2500, // Mock ETH price
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
        }
      ];

      // Add some mock ERC-20 tokens for demonstration
      if (ethBalance > 0) {
        mockHoldings.push(
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            balance: Math.random() * 1000,
            value: Math.random() * 1000,
            image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'
          },
          {
            id: 'chainlink',
            symbol: 'LINK',
            name: 'Chainlink',
            balance: Math.random() * 100,
            value: Math.random() * 1500,
            image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png'
          }
        );
      }

      setHoldings(mockHoldings);
    } catch (err) {
      console.error('Error fetching wallet holdings:', err);
      setError('Failed to fetch wallet holdings');
    } finally {
      setLoading(false);
    }
  };

  const importToPortfolio = (holding: WalletHolding) => {
    // This would integrate with the existing portfolio system
    const crypto = {
      id: holding.id,
      symbol: holding.symbol,
      name: holding.name,
      image: holding.image,
      current_price: holding.value / holding.balance
    };
    
    // Return the crypto object so it can be added to portfolio
    return { crypto, amount: holding.balance };
  };

  return {
    holdings,
    loading,
    error,
    importToPortfolio,
    refetch: fetchWalletHoldings
  };
};
