// User types
export interface User {
  _id?: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  avatar_url?: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  avatar_url?: string;
}

// Portfolio types
export interface PortfolioItem {
  _id?: string;
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  amount: number;
  purchase_price: number;
  purchase_date: Date;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePortfolioItemInput {
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  amount: number;
  purchase_price: number;
  purchase_date?: Date;
  image_url?: string;
}

export interface UpdatePortfolioItemInput {
  amount?: number;
  purchase_price?: number;
  purchase_date?: Date;
  image_url?: string;
}

// Watchlist types
export interface WatchlistItem {
  _id?: string;
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  image_url?: string;
  created_at: Date;
}

export interface CreateWatchlistItemInput {
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  image_url?: string;
}

// Alert types
export interface Alert {
  _id?: string;
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAlertInput {
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
}

export interface UpdateAlertInput {
  target_price?: number;
  condition?: 'above' | 'below';
  is_active?: boolean;
}

// Transaction types
export interface Transaction {
  _id?: string;
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total_value: number;
  created_at: Date;
}

export interface CreateTransactionInput {
  user_id: string;
  coin_id: string;
  name: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total_value: number;
}

// Database types
export interface Database {
  users: User[];
  portfolios: PortfolioItem[];
  watchlists: WatchlistItem[];
  alerts: Alert[];
  transactions: Transaction[];
} 