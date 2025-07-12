
import { motion } from 'framer-motion';

interface CurrencySelectorProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

const currencies = [
  { code: 'usd', symbol: '$', name: 'USD' },
  { code: 'eur', symbol: '€', name: 'EUR' },
  { code: 'inr', symbol: '₹', name: 'INR' },
];

export const CurrencySelector = ({ currency, onCurrencyChange }: CurrencySelectorProps) => {
  return (
    <motion.div 
      className="flex gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {currencies.map((curr) => (
        <motion.button
          key={curr.code}
          onClick={() => onCurrencyChange(curr.code)}
          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
            currency === curr.code
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {curr.symbol} {curr.name}
        </motion.button>
      ))}
    </motion.div>
  );
};
