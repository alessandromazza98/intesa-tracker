import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';
import { CoinGeckoService } from './services/coingecko.js';
import { CoinPaprikaService } from './services/coinpaprika.js';
import { CryptoServiceManager } from './services/crypto-service-manager.js';
import { CacheService } from './services/cache.js';
import { ApiResponse } from './types/api.js';

// Load environment variables from root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const app = express();
const port = process.env.PORT || 3456;

// Initialize services
const serviceManager = new CryptoServiceManager([new CoinGeckoService(), new CoinPaprikaService()]);
const cacheService = new CacheService();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Define route handlers
const priceHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { symbol } = req.params;

    // Check cache first
    const cachedPrice = cacheService.getCachedPrice(symbol);
    if (cachedPrice) {
      const response: ApiResponse<typeof cachedPrice> = {
        success: true,
        data: cachedPrice,
      };
      return res.json(response);
    }

    // Get fresh data using service manager
    const price = await serviceManager.getCurrentPrice(symbol);
    cacheService.setCachedPrice(symbol, price);

    const response: ApiResponse<typeof price> = {
      success: true,
      data: price,
    };
    return res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
    return res.status(500).json(response);
  }
};

const historicalHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { symbol } = req.params;
    const days = parseInt(req.query.days as string) || 7;

    // Check cache first
    const cachedPrices = cacheService.getCachedHistoricalPrices(symbol, days);
    if (cachedPrices) {
      const response: ApiResponse<typeof cachedPrices> = {
        success: true,
        data: cachedPrices,
      };
      return res.json(response);
    }

    // Get fresh data using service manager
    const prices = await serviceManager.getHistoricalPrices(symbol, days);
    cacheService.setCachedHistoricalPrices(symbol, days, prices);

    const response: ApiResponse<typeof prices> = {
      success: true,
      data: prices,
    };
    return res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
    return res.status(500).json(response);
  }
};

// Mount routes
app.get('/api/price/:symbol', priceHandler);
app.get('/api/historical/:symbol', historicalHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
