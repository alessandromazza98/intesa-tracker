import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "./components/Header";
import { Chart } from "./components/Chart";
import { TransactionTable } from "./components/TransactionTable";
import { BitcoinHolding, BitcoinPrice, BitcoinTransaction } from "./types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock data for now - replace with real data from your backend
const mockTransactions: BitcoinTransaction[] = [
  {
    date: "2025-01-13",
    amount: 11,
    priceUSD: 93380.72,
    priceEUR: 90909,
    totalUSD: 1027187,
    totalEUR: 1000000,
  },
];

function App() {
  const [priceData, setPriceData] = useState<BitcoinPrice[]>([]);
  const [holdings, setHoldings] = useState<BitcoinHolding>({
    totalBitcoin: 11,
    valueUSD: 0,
    valueEUR: 0,
    pnlUSD: 0,
    pnlEUR: 0,
    pnlPercentageUSD: 0,
    pnlPercentageEUR: 0,
  });

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        // Fetch current price and historical data from our backend
        const [currentResponse, historicalResponse] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/price/bitcoin`),
          axios.get(`${BACKEND_URL}/api/historical/bitcoin?days=60`)
        ]);
        
        if (!currentResponse.data.success || !historicalResponse.data.success) {
          throw new Error("Failed to fetch data from backend");
        }

        const currentPrice: BitcoinPrice = {
          usd: currentResponse.data.data.price,
          eur: currentResponse.data.data.priceEUR,
          timestamp: currentResponse.data.data.timestamp,
        };

        // Calculate current holdings value and PNL
        const currentValueUSD = holdings.totalBitcoin * currentPrice.usd;
        const currentValueEUR = holdings.totalBitcoin * currentPrice.eur;
        
        const totalInvestedUSD = mockTransactions.reduce((sum, t) => sum + t.totalUSD, 0);
        const totalInvestedEUR = mockTransactions.reduce((sum, t) => sum + t.totalEUR, 0);
        
        const pnlUSD = currentValueUSD - totalInvestedUSD;
        const pnlEUR = currentValueEUR - totalInvestedEUR;
        const pnlPercentageUSD = (pnlUSD / totalInvestedUSD) * 100;
        const pnlPercentageEUR = (pnlEUR / totalInvestedEUR) * 100;

        setHoldings({
          ...holdings,
          valueUSD: currentValueUSD,
          valueEUR: currentValueEUR,
          pnlUSD,
          pnlEUR,
          pnlPercentageUSD,
          pnlPercentageEUR,
        });

        // Process historical data - now using both USD and EUR prices
        const historicalData: BitcoinPrice[] = historicalResponse.data.data.prices.map(
          (usdPrice: [number, number], index: number) => {
            const eurPrice = historicalResponse.data.data.pricesEUR[index];
            return {
              timestamp: usdPrice[0],
              usd: usdPrice[1],
              eur: eurPrice[1],
            };
          }
        );

        // Add current price to the end of historical data
        historicalData.push(currentPrice);

        setPriceData(historicalData);
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    };

    fetchPriceData(); // Initial fetch
    const interval = setInterval(fetchPriceData, 15 * 60 * 1000); // Fetch every 15 minutes

    return () => clearInterval(interval);
  }, [holdings]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="w-full max-w-6xl mx-auto px-4 pt-8 flex-grow space-y-4">
        <Header holdings={holdings} />
        <Chart priceData={priceData} transactions={mockTransactions} />
        <TransactionTable transactions={mockTransactions} />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <footer className="text-center py-4 text-blue-300 text-base">
          Made with ❤️ by{" "}
          <a 
            href="https://x.com/crypto_ita2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Alessandro Mazza
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
