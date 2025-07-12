
import { useState, useEffect } from 'react';
import { portfolioServices } from '@/integrations/mongodb/services';
import { PortfolioItem, CreatePortfolioItemInput } from '@/integrations/mongodb/types';
import { useAuth } from './useAuth';
import { useMongoDB } from './useMongoDB';
import { useToast } from './use-toast';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    crypto: any | null;
  }>({
    isOpen: false,
    crypto: null
  });
  const { user } = useAuth();
  const { isConnected } = useMongoDB();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isConnected) {
      fetchPortfolio();
    } else {
      setPortfolio([]);
    }
  }, [user, isConnected]);

  const fetchPortfolio = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const portfolioData = await portfolioServices.getUserPortfolio(user._id.toString());
      setPortfolio(portfolioData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToPortfolio = async (crypto: any) => {
    if (!user?._id) {
      toast({
        title: "Authentication Required",
        description: "Please login first to add crypto to your portfolio",
        variant: "destructive",
      });
      return;
    }
    
    // Open the modal instead of using prompts
    setModalState({
      isOpen: true,
      crypto
    });
  };

  const handleAddToPortfolioConfirm = async (amount: number, purchasePrice: number) => {
    if (!user?._id || !modalState.crypto) return;

    try {
      const portfolioData: CreatePortfolioItemInput = {
        user_id: user._id,
        coin_id: modalState.crypto.id,
        name: modalState.crypto.name,
        symbol: modalState.crypto.symbol,
        amount: amount,
        purchase_price: purchasePrice,
        image_url: modalState.crypto.image
      };

      await portfolioServices.addToPortfolio(portfolioData);
      await fetchPortfolio(); // Refresh the portfolio
      
      toast({
        title: "Success!",
        description: `${modalState.crypto.name} has been added to your portfolio`,
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to portfolio');
      console.error('Error adding to portfolio:', err);
      
      toast({
        title: "Error",
        description: "Failed to add crypto to portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      crypto: null
    });
  };

  const removeFromPortfolio = async (portfolioItemId: string) => {
    try {
      await portfolioServices.removeFromPortfolio(portfolioItemId);
      await fetchPortfolio(); // Refresh the portfolio
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from portfolio');
      console.error('Error removing from portfolio:', err);
    }
  };

  const updateHolding = async (portfolioItemId: string, newAmount: number) => {
    if (newAmount <= 0) {
      await removeFromPortfolio(portfolioItemId);
      return;
    }
    
    try {
      await portfolioServices.updatePortfolioItem(portfolioItemId, { amount: newAmount });
      await fetchPortfolio(); // Refresh the portfolio
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio');
      console.error('Error updating portfolio:', err);
    }
  };

  return {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updateHolding,
    loading,
    error,
    refetch: fetchPortfolio,
    modalState,
    handleAddToPortfolioConfirm,
    closeModal
  };
};
