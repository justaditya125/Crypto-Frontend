
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Wallet, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CryptoHeader = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header 
      className="text-center mb-8 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* User info and logout button, or Login/Sign Up buttons */}
      <div className="absolute top-0 right-0 flex items-center gap-3 z-50">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
              <User className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-slate-200 font-medium">
                Welcome, {user.name}
              </span>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30 hover:border-red-400/70 transition-all duration-300 cursor-pointer z-50 relative"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              size="sm"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-600/20 hover:border-purple-400/70 transition-all duration-300 cursor-pointer z-50 relative"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              variant="default"
              size="sm"
              className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 cursor-pointer z-50 relative"
            >
              Sign Up
            </Button>
          </>
        )}
      </div>

      <motion.div
        className="flex items-center justify-center gap-3 mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Crypto Tracker
        </h1>
      </motion.div>
      
      <motion.p 
        className="text-xl text-slate-300 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Real-time cryptocurrency portfolio tracking with advanced analytics
      </motion.p>
      
      <motion.div 
        className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span>Live Charts</span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span>Portfolio Tracking</span>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Price Alerts</span>
        </div>
      </motion.div>
    </motion.header>
  );
};
