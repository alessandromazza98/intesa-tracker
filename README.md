# Banca Intesa Bitcoin Tracker

A web application to track Bitcoin investment for Banca Intesa.

## Project Structure

```
/banca-intesa-tracker
  /frontend - React frontend application
  /backend  - Node.js/Express backend server
```

## Features

- Real-time Bitcoin price tracking in USD and EUR
- Historical price charts
- Investment performance tracking
- Multiple API sources with fallback
- Caching layer to handle rate limits

## Development Setup

1. Install dependencies for all projects:
```bash
npm run install:all
```

2. Start both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
- Frontend only: `npm run frontend`
- Backend only: `npm run backend`

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:3000

## Building for Production

```bash
npm run build
```

This will build both frontend and backend applications.

## API Endpoints

### Backend API

- `GET /health` - Health check endpoint
- `GET /api/price/bitcoin` - Get current Bitcoin price in USD and EUR
- `GET /api/historical/bitcoin?days=60` - Get historical price data

## Contributing

Feel free to open issues and pull requests!

## Author

Made with ❤️ by [Alessandro Mazza](https://x.com/crypto_ita2)
