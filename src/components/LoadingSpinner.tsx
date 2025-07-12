
import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <motion.div
      className="w-8 h-8 border-4 border-slate-600 border-t-purple-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};
