import { CryptoApiService, CryptoPrice, HistoricalPrice } from '../types/api';

export class CryptoServiceManager {
  private services: CryptoApiService[];
  private currentServiceIndex = 0;
  private maxRetries = 3;
  private baseDelay = 1000; // Start with 1 second delay

  constructor(services: CryptoApiService[]) {
    this.services = services;
  }

  private async delay(attempt: number) {
    // Exponential backoff: 1s, 2s, 4s, etc.
    const delayMs = this.baseDelay * Math.pow(2, attempt);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  private async withRetry<T>(operation: (service: CryptoApiService) => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      // Try each service before moving to the next retry attempt
      for (let i = 0; i < this.services.length; i++) {
        const serviceIndex = (this.currentServiceIndex + i) % this.services.length;
        const service = this.services[serviceIndex];
        
        try {
          const result = await operation(service);
          // On success, update the current service index to start with this successful service next time
          this.currentServiceIndex = serviceIndex;
          return result;
        } catch (error) {
          console.error(`Error with ${service.getName()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          lastError = error instanceof Error ? error : new Error('Unknown error');
          continue; // Try next service
        }
      }
      
      // If we're here, all services failed in this attempt
      if (attempt < this.maxRetries - 1) {
        console.log(`All services failed, attempt ${attempt + 1}/${this.maxRetries}. Waiting before retry...`);
        await this.delay(attempt);
      }
    }
    
    throw lastError || new Error('All services failed');
  }

  async getCurrentPrice(symbol: string): Promise<CryptoPrice> {
    return this.withRetry(service => service.getCurrentPrice(symbol));
  }

  async getHistoricalPrices(symbol: string, days: number): Promise<HistoricalPrice> {
    return this.withRetry(service => service.getHistoricalPrices(symbol, days));
  }
} 