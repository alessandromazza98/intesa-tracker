import axios from 'axios';
import { CryptoApiService, CryptoPrice, HistoricalPrice } from '../types/api';

export class CoinGeckoService implements CryptoApiService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';
  private lastCallTimestamp = 0;
  private readonly minCallInterval = 1000; // 1 second minimum between calls

  getName(): string {
    return 'CoinGecko';
  }

  private async throttleCall(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTimestamp;
    if (timeSinceLastCall < this.minCallInterval) {
      await new Promise((resolve) => setTimeout(resolve, this.minCallInterval - timeSinceLastCall));
    }
    this.lastCallTimestamp = Date.now();
  }

  async getCurrentPrice(symbol: string): Promise<CryptoPrice> {
    await this.throttleCall();
    const response = await axios.get(`${this.baseUrl}/simple/price`, {
      params: {
        ids: symbol,
        vs_currencies: 'usd,eur',
      },
    });

    return {
      price: response.data[symbol].usd,
      priceEUR: response.data[symbol].eur,
      timestamp: Date.now(),
      source: this.getName(),
    };
  }

  async getHistoricalPrices(symbol: string, days: number): Promise<HistoricalPrice> {
    await this.throttleCall();
    const [usdResponse, eurResponse] = await Promise.all([
      axios.get(`${this.baseUrl}/coins/${symbol}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'daily',
        },
      }),
      axios.get(`${this.baseUrl}/coins/${symbol}/market_chart`, {
        params: {
          vs_currency: 'eur',
          days: days,
          interval: 'daily',
        },
      }),
    ]);

    return {
      prices: usdResponse.data.prices,
      pricesEUR: eurResponse.data.prices,
      source: this.getName(),
    };
  }
}
