import { useEffect, useState } from 'react';
import { connectToMongoDB, disconnectFromMongoDB } from '@/integrations/mongodb/client';

// Singleton to track connection state
let connectionPromise: Promise<void> | null = null;
let globalIsConnected = false;

export const useMongoDB = () => {
  const [isConnected, setIsConnected] = useState(globalIsConnected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      // If already connected, don't connect again
      if (globalIsConnected) {
        setIsConnected(true);
        return;
      }

      // If already connecting, wait for that connection
      if (connectionPromise) {
        setIsConnecting(true);
        try {
          await connectionPromise;
          setIsConnecting(false);
          setIsConnected(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to connect to MongoDB');
          setIsConnecting(false);
          setIsConnected(false);
        }
        return;
      }

      setIsConnecting(true);
      setError(null);
      
      connectionPromise = connectToMongoDB();
      
      try {
        await connectionPromise;
        globalIsConnected = true;
        setIsConnected(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to MongoDB');
        globalIsConnected = false;
        setIsConnected(false);
      } finally {
        setIsConnecting(false);
        connectionPromise = null;
      }
    };

    connect();

    // Only disconnect on actual component unmount, not re-renders
    return () => {
      // Don't disconnect here - let it persist
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error
  };
}; 