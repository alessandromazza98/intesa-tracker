export interface BitcoinHolding {
  totalBitcoin: number;
  valueUSD: number;
  valueEUR: number;
  pnlUSD: number;
  pnlEUR: number;
  pnlPercentageUSD: number;
  pnlPercentageEUR: number;
}

export interface BitcoinTransaction {
  date: string;
  amount: number;
  priceUSD: number;
  priceEUR: number;
  totalUSD: number;
  totalEUR: number;
}

export interface BitcoinPrice {
  usd: number;
  eur: number;
  timestamp: number;
} 