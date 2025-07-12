
import { useState, useEffect } from 'react';

export const useCryptoData = (currency: string) => {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate that we received an array
        if (Array.isArray(data)) {
          setCryptoData(data);
        } else {
          console.error('Invalid data format received from API');
          setCryptoData([]);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch crypto data');
        setCryptoData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    
    // Set up interval to fetch data every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000);
    
    return () => clearInterval(interval);
  }, [currency]);

  return { cryptoData, loading, error };
};
