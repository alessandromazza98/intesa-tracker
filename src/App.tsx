import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "./components/Header";
import { Chart } from "./components/Chart";
import { TransactionTable } from "./components/TransactionTable";
import { BitcoinHolding, BitcoinPrice, BitcoinTransaction } from "./types";

// Mock data for now - replace with real data from your backend
const mockTransactions: BitcoinTransaction[] = [
  {
    date: "2025-01-13",
    amount: 11,
    priceUSD: 93380.72, // Using 1 EUR = 1.03 USD conversion rate
    priceEUR: 90909,
    totalUSD: 1027187, // 11 * 93380.72
    totalEUR: 1000000, // 11 * 90909
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
        // Fetch current price and historical data
        const [currentResponse, historicalResponse] = await Promise.all([
          axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur"),
          axios.get("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=60&interval=daily")
        ]);
        
        const currentPrice: BitcoinPrice = {
          usd: currentResponse.data.bitcoin.usd,
          eur: currentResponse.data.bitcoin.eur,
          timestamp: Date.now(),
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

        // Process historical data
        const historicalData: BitcoinPrice[] = historicalResponse.data.prices.map(
          ([timestamp, price]: [number, number]) => ({
            timestamp,
            usd: price,
            eur: price / currentResponse.data.bitcoin.usd * currentResponse.data.bitcoin.eur, // Convert using current exchange rate
          })
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="w-full max-w-6xl mx-auto px-4 py-4 flex-grow space-y-4">
        <Header holdings={holdings} />
        <Chart priceData={priceData} transactions={mockTransactions} />
        <TransactionTable transactions={mockTransactions} />
      </div>
      <footer className="text-center py-2 text-blue-300 text-sm">
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
  );
}

export default App;
