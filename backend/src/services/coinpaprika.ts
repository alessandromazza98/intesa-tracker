import axios from 'axios';
import { CryptoApiService, CryptoPrice, HistoricalPrice } from '../types/api';

interface CoinPaprikaHistoricalDataPoint {
  timestamp: string;
  price: number;
  volume_24h: number;
  market_cap: number;
}

export class CoinPaprikaService implements CryptoApiService {
  private readonly baseUrl = 'https://api.coinpaprika.com/v1';
  private lastCallTimestamp = 0;
  private readonly minCallInterval = 1000; // 1 second minimum between calls

  getName(): string {
    return 'CoinPaprika';
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
    // CoinPaprika uses different IDs, we'll use btc-bitcoin for Bitcoin
    const coinId = symbol === 'bitcoin' ? 'btc-bitcoin' : symbol;

    // Fetch both USD and EUR prices
    const [usdResponse, eurResponse] = await Promise.all([
      axios.get(`${this.baseUrl}/tickers/${coinId}?quotes=USD`),
      axios.get(`${this.baseUrl}/tickers/${coinId}?quotes=EUR`),
    ]);

    return {
      price: usdResponse.data.quotes.USD.price,
      priceEUR: eurResponse.data.quotes.EUR.price,
      timestamp: Date.now(),
      source: this.getName(),
    };
  }

  async getHistoricalPrices(symbol: string, days: number): Promise<HistoricalPrice> {
    await this.throttleCall();
    const coinId = symbol === 'bitcoin' ? 'btc-bitcoin' : symbol;
    const start = new Date();
    start.setDate(start.getDate() - days);

    // Fetch historical data for both USD and EUR
    const [usdResponse, eurResponse] = await Promise.all([
      axios.get<CoinPaprikaHistoricalDataPoint[]>(`${this.baseUrl}/tickers/${coinId}/historical`, {
        params: {
          start: start.toISOString().split('T')[0],
          interval: '1d',
          quote: 'USD',
        },
      }),
      axios.get<CoinPaprikaHistoricalDataPoint[]>(`${this.baseUrl}/tickers/${coinId}/historical`, {
        params: {
          start: start.toISOString().split('T')[0],
          interval: '1d',
          quote: 'EUR',
        },
      }),
    ]);

    const prices = usdResponse.data.map((item: CoinPaprikaHistoricalDataPoint) => [
      new Date(item.timestamp).getTime(),
      item.price,
    ]);

    const pricesEUR = eurResponse.data.map((item: CoinPaprikaHistoricalDataPoint) => [
      new Date(item.timestamp).getTime(),
      item.price,
    ]);

    return {
      prices,
      pricesEUR,
      source: this.getName(),
    };
  }
}
