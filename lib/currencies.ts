import { CurrencyCode, CurrencyOption } from '@/types';

export const CURRENCIES: Record<CurrencyCode, CurrencyOption> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    label: 'Indian Rupee (INR)',
    rate: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar (USD)',
    rate: 0.012, // 1 INR ~ 0.012 USD
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'Euro (EUR)',
    rate: 0.011,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'British Pound (GBP)',
    rate: 0.0094,
  },
};

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = amount * curr.rate;

  if (currencyCode === 'INR') {
    // Format with Indian numbering system (e.g., 35,000)
    return `${curr.symbol}${converted.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`;
  }

  return `${curr.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
