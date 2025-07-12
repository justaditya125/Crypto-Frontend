
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface Alert {
  id: string;
  coin_id: string;
  name: string;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  created_at: string;
}

interface AlertsProps {
  cryptoData: any[];
  currency: string;
}

export const Alerts = ({ cryptoData, currency }: AlertsProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleAddAlert = () => {
    if (!selectedCrypto || !targetPrice) return;

    const crypto = cryptoData.find(c => c.id === selectedCrypto);
    if (!crypto) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      coin_id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      target_price: Number(targetPrice),
      condition,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setAlerts(prev => [...prev, newAlert]);
    setSelectedCrypto('');
    setTargetPrice('');
    setShowAddForm(false);
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_active: !alert.is_active }
          : alert
      )
    );
  };

  const getAlertStatus = (alert: Alert) => {
    const crypto = cryptoData.find(c => c.id === alert.coin_id);
    if (!crypto) return 'unknown';

    const currentPrice = crypto.current_price;
    const targetPrice = alert.target_price;

    if (alert.condition === 'above' && currentPrice >= targetPrice) {
      return 'triggered';
    } else if (alert.condition === 'below' && currentPrice <= targetPrice) {
      return 'triggered';
    }
    return 'waiting';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Price Alerts</h2>
            <p className="text-slate-400">Get notified when prices hit your targets</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Alert
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Create New Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cryptocurrency
              </label>
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select crypto</option>
                {cryptoData.map(crypto => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Price
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAddAlert}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Alert
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Price Alerts</h3>
            <p className="text-slate-400">Create your first alert to get notified when prices change</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const status = getAlertStatus(alert);
            const crypto = cryptoData.find(c => c.id === alert.coin_id);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                  status === 'triggered' 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {crypto?.image && (
                      <img 
                        src={crypto.image} 
                        alt={alert.name} 
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {alert.name} ({alert.symbol.toUpperCase()})
                      </h4>
                      <p className="text-slate-300">
                        Alert when price goes {alert.condition} {formatCurrency(alert.target_price, currency)}
                      </p>
                      {crypto && (
                        <p className="text-sm text-slate-400">
                          Current: {formatCurrency(crypto.current_price, currency)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === 'triggered' && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Triggered!
                      </span>
                    )}
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        alert.is_active ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          alert.is_active ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
