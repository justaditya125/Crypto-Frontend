import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddToPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, purchasePrice: number) => void;
  crypto: any;
  currency: string;
}

export const AddToPortfolioModal = ({
  isOpen,
  onClose,
  onConfirm,
  crypto,
  currency
}: AddToPortfolioModalProps) => {
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; purchasePrice?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate inputs
    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(purchasePrice);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setErrors(prev => ({ ...prev, amount: 'Please enter a valid amount greater than 0' }));
      return;
    }
    
    if (!purchasePrice || isNaN(priceNum) || priceNum <= 0) {
      setErrors(prev => ({ ...prev, purchasePrice: 'Please enter a valid purchase price greater than 0' }));
      return;
    }
    
    onConfirm(amountNum, priceNum);
    handleClose();
  };

  const handleClose = () => {
    setAmount('');
    setPurchasePrice('');
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">Add to Portfolio</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Crypto Info */}
                <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                  <img
                    src={crypto?.image || '/placeholder.svg'}
                    alt={crypto?.name || 'Cryptocurrency'}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-white text-lg">{crypto?.name || 'Unknown'}</h3>
                    <p className="text-slate-400 text-sm uppercase">{crypto?.symbol || 'N/A'}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-300">
                      Amount of {crypto?.symbol?.toUpperCase() || 'CRYPTO'}
                    </Label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-400 text-sm">{errors.amount}</p>
                    )}
                  </div>

                  {/* Purchase Price Input */}
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice" className="text-slate-300">
                      Purchase Price per {crypto?.symbol?.toUpperCase() || 'CRYPTO'}
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    {errors.purchasePrice && (
                      <p className="text-red-400 text-sm">{errors.purchasePrice}</p>
                    )}
                  </div>

                  {/* Total Value Preview */}
                  {amount && purchasePrice && !isNaN(parseFloat(amount)) && !isNaN(parseFloat(purchasePrice)) && (
                    <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-300 text-sm">Total Value:</p>
                      <p className="text-white font-semibold">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: currency.toUpperCase()
                        }).format(parseFloat(amount) * parseFloat(purchasePrice))}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Add to Portfolio
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 