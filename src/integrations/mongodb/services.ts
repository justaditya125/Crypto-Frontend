import { getCollections } from './client';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  PortfolioItem,
  CreatePortfolioItemInput,
  UpdatePortfolioItemInput,
  WatchlistItem,
  CreateWatchlistItemInput,
  Alert,
  CreateAlertInput,
  UpdateAlertInput,
  Transaction,
  CreateTransactionInput
} from './types';

// User Services
export const userServices = {
  async createUser(userData: CreateUserInput): Promise<User> {
    const { users } = getCollections();
    const now = new Date();
    const user: Omit<User, '_id'> = {
      ...userData,
      created_at: now,
      updated_at: now
    };
    
    const result = await users.insertOne(user);
    return { _id: result.insertedId, ...user };
  },

  async getUserById(id: string): Promise<User | null> {
    const { users } = getCollections();
    const result = await users.findOne({ _id: id });
    return result as User | null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { users } = getCollections();
    const result = await users.findOne({ email });
    return result as User | null;
  },

  async updateUser(id: string, updateData: UpdateUserInput): Promise<User | null> {
    const { users } = getCollections();
    const updateDoc = {
      ...updateData,
      updated_at: new Date()
    };
    
    const result = await users.findOneAndUpdate(
      { _id: id },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
    
    return result as User | null;
  },

  async deleteUser(id: string): Promise<boolean> {
    const { users } = getCollections();
    const result = await users.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
};

// Portfolio Services
export const portfolioServices = {
  async getUserPortfolio(userId: string): Promise<PortfolioItem[]> {
    const { portfolios } = getCollections();
    const result = await portfolios.find({ user_id: userId });
    return result as PortfolioItem[];
  },

  async addToPortfolio(portfolioData: CreatePortfolioItemInput): Promise<PortfolioItem> {
    const { portfolios } = getCollections();
    const now = new Date();
    const portfolioItem: Omit<PortfolioItem, '_id'> = {
      ...portfolioData,
      purchase_date: portfolioData.purchase_date || now,
      created_at: now,
      updated_at: now
    };
    
    const result = await portfolios.insertOne(portfolioItem);
    return { _id: result.insertedId, ...portfolioItem };
  },

  async updatePortfolioItem(id: string, updateData: UpdatePortfolioItemInput): Promise<PortfolioItem | null> {
    const { portfolios } = getCollections();
    const updateDoc = {
      ...updateData,
      updated_at: new Date()
    };
    
    const result = await portfolios.findOneAndUpdate(
      { _id: id },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
    
    return result as PortfolioItem | null;
  },

  async removeFromPortfolio(id: string): Promise<boolean> {
    const { portfolios } = getCollections();
    const result = await portfolios.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },

  async getPortfolioItem(id: string): Promise<PortfolioItem | null> {
    const { portfolios } = getCollections();
    const result = await portfolios.findOne({ _id: id });
    return result as PortfolioItem | null;
  }
};

// Watchlist Services
export const watchlistServices = {
  async getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
    const { watchlists } = getCollections();
    const result = await watchlists.find({ user_id: userId });
    return result as WatchlistItem[];
  },

  async addToWatchlist(watchlistData: CreateWatchlistItemInput): Promise<WatchlistItem> {
    const { watchlists } = getCollections();
    const watchlistItem: Omit<WatchlistItem, '_id'> = {
      ...watchlistData,
      created_at: new Date()
    };
    
    const result = await watchlists.insertOne(watchlistItem);
    return { _id: result.insertedId, ...watchlistItem };
  },

  async removeFromWatchlist(id: string): Promise<boolean> {
    const { watchlists } = getCollections();
    const result = await watchlists.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },

  async isInWatchlist(userId: string, coinId: string): Promise<boolean> {
    const { watchlists } = getCollections();
    const item = await watchlists.findOne({
      user_id: userId,
      coin_id: coinId
    });
    return !!item;
  }
};

// Alert Services
export const alertServices = {
  async getUserAlerts(userId: string): Promise<Alert[]> {
    const { alerts } = getCollections();
    const result = await alerts.find({ user_id: userId });
    return result as Alert[];
  },

  async createAlert(alertData: CreateAlertInput): Promise<Alert> {
    const { alerts } = getCollections();
    const now = new Date();
    const alert: Omit<Alert, '_id'> = {
      ...alertData,
      is_active: true,
      created_at: now,
      updated_at: now
    };
    
    const result = await alerts.insertOne(alert);
    return { _id: result.insertedId, ...alert };
  },

  async updateAlert(id: string, updateData: UpdateAlertInput): Promise<Alert | null> {
    const { alerts } = getCollections();
    const updateDoc = {
      ...updateData,
      updated_at: new Date()
    };
    
    const result = await alerts.findOneAndUpdate(
      { _id: id },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
    
    return result as Alert | null;
  },

  async deleteAlert(id: string): Promise<boolean> {
    const { alerts } = getCollections();
    const result = await alerts.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },

  async toggleAlert(id: string): Promise<Alert | null> {
    const { alerts } = getCollections();
    const alert = await alerts.findOne({ _id: id }) as Alert | null;
    if (!alert) return null;
    
    const result = await alerts.findOneAndUpdate(
      { _id: id },
      { 
        $set: { 
          is_active: !alert.is_active,
          updated_at: new Date()
        } 
      },
      { returnDocument: 'after' }
    );
    
    return result as Alert | null;
  }
};

// Transaction Services
export const transactionServices = {
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const { transactions } = getCollections();
    const result = await transactions.find({ user_id: userId });
    return result as Transaction[];
  },

  async createTransaction(transactionData: CreateTransactionInput): Promise<Transaction> {
    const { transactions } = getCollections();
    const transaction: Omit<Transaction, '_id'> = {
      ...transactionData,
      created_at: new Date()
    };
    
    const result = await transactions.insertOne(transaction);
    return { _id: result.insertedId, ...transaction };
  },

  async getTransaction(id: string): Promise<Transaction | null> {
    const { transactions } = getCollections();
    const result = await transactions.findOne({ _id: id });
    return result as Transaction | null;
  }
}; 