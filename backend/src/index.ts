import express from 'express';
import cors from 'cors';
import { CoinGeckoService } from './services/coingecko';
import { CacheService } from './services/cache';
import { ApiResponse } from './types/api';

const app = express();
const port = process.env.PORT || 3000;

// Initialize services
const coinGeckoService = new CoinGeckoService();
const cacheService = new CacheService();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get current price endpoint
app.get('/api/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Check cache first
    const cachedPrice = cacheService.getCachedPrice(symbol);
    if (cachedPrice) {
      const response: ApiResponse<typeof cachedPrice> = {
        success: true,
        data: cachedPrice
      };
      return res.json(response);
    }

    // Get fresh data
    const price = await coinGeckoService.getCurrentPrice(symbol);
    cacheService.setCachedPrice(symbol, price);
    
    const response: ApiResponse<typeof price> = {
      success: true,
      data: price
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    res.status(500).json(response);
  }
});

// Get historical prices endpoint
app.get('/api/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const days = parseInt(req.query.days as string) || 7;

    // Check cache first
    const cachedPrices = cacheService.getCachedHistoricalPrices(symbol, days);
    if (cachedPrices) {
      const response: ApiResponse<typeof cachedPrices> = {
        success: true,
        data: cachedPrices
      };
      return res.json(response);
    }

    // Get fresh data
    const prices = await coinGeckoService.getHistoricalPrices(symbol, days);
    cacheService.setCachedHistoricalPrices(symbol, days, prices);
    
    const response: ApiResponse<typeof prices> = {
      success: true,
      data: prices
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    res.status(500).json(response);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 