export interface CryptoPrice {
  price: number;
  priceEUR: number;
  timestamp: number;
  source: string;
}

export interface HistoricalPrice {
  prices: Array<[number, number]>; // [timestamp, price]
  pricesEUR: Array<[number, number]>; // [timestamp, price]
  source: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CryptoApiService {
  getName(): string;
  getCurrentPrice(symbol: string): Promise<CryptoPrice>;
  getHistoricalPrices(symbol: string, days: number): Promise<HistoricalPrice>;
}
