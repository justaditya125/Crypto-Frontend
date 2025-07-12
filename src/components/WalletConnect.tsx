
import { motion } from 'framer-motion';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

export const WalletConnect = () => {
  const { wallet, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (wallet.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!wallet.isConnected) {
    return (
      <motion.button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </motion.button>
    );
  }

  return (
    <motion.div
      className="flex items-center gap-3 p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm text-slate-300">Connected</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-white font-mono text-sm">
          {formatAddress(wallet.address!)}
        </span>
        <button
          onClick={copyAddress}
          className="p-1 text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>

      <div className="text-sm text-slate-300">
        {wallet.balance} ETH
      </div>

      <button
        onClick={disconnectWallet}
        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
