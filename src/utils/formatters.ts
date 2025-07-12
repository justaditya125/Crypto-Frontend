
export const formatCurrency = (
  amount: number | null | undefined, 
  currency: string, 
  compact: boolean = false
): string => {
  // Handle null, undefined, or invalid numbers
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${getCurrencySymbol(currency)}0.00`;
  }

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  if (compact && amount >= 1000000) {
    options.notation = 'compact';
    options.compactDisplay = 'short';
  }

  try {
    return new Intl.NumberFormat('en-US', options).format(amount);
  } catch (error) {
    // Fallback if currency is not supported
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  return `${value.toFixed(2)}%`;
};

const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    'usd': '$',
    'eur': '€',
    'inr': '₹',
    'btc': '₿',
    'eth': 'Ξ'
  };
  
  return symbols[currency.toLowerCase()] || '$';
};
