import NodeCache from 'node-cache';
import { CryptoPrice, HistoricalPrice } from '../types/api.js';

interface CacheParams {
  days?: number;
  [key: string]: unknown;
}

export class CacheService {
  private cache: NodeCache;

  constructor(stdTTL: number = 300) {
    // 5 minutes default TTL
    this.cache = new NodeCache({
      stdTTL,
      checkperiod: stdTTL * 0.2,
    });
  }

  private getKey(type: string, symbol: string, params?: CacheParams): string {
    return `${type}:${symbol}${params ? ':' + JSON.stringify(params) : ''}`;
  }

  getCachedPrice(symbol: string): CryptoPrice | undefined {
    const key = this.getKey('price', symbol);
    return this.cache.get<CryptoPrice>(key);
  }

  setCachedPrice(symbol: string, price: CryptoPrice): void {
    const key = this.getKey('price', symbol);
    this.cache.set(key, price);
  }

  getCachedHistoricalPrices(symbol: string, days: number): HistoricalPrice | undefined {
    const key = this.getKey('historical', symbol, { days });
    return this.cache.get<HistoricalPrice>(key);
  }

  setCachedHistoricalPrices(symbol: string, days: number, prices: HistoricalPrice): void {
    const key = this.getKey('historical', symbol, { days });
    this.cache.set(key, prices);
  }

  clearCache(): void {
    this.cache.flushAll();
  }
}
