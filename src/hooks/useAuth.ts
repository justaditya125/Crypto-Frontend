
import { useState, useEffect } from 'react';
import { userServices } from '@/integrations/mongodb/services';
import { User, CreateUserInput } from '@/integrations/mongodb/types';
import { useMongoDB } from './useMongoDB';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useMongoDB();

  useEffect(() => {
    // Check if user is logged in on component mount
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId && isConnected) {
      userServices.getUserById(storedUserId)
        .then(userData => {
          if (userData) {
            setUser(userData);
          }
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          localStorage.removeItem('userId');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const login = async (userData: CreateUserInput) => {
    try {
      // Check if user exists
      let existingUser = await userServices.getUserByEmail(userData.email);
      
      if (!existingUser) {
        // Create new user
        existingUser = await userServices.createUser(userData);
      }
      
      setUser(existingUser);
      localStorage.setItem('userId', existingUser._id!.toString());
      return existingUser;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logout function called');
    setUser(null);
    localStorage.removeItem('userId');
    console.log('Logout completed');
  };

  const isAuthenticated = !!user;

  return {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };
};
