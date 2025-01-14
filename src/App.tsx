import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "./components/Header";
import { Chart } from "./components/Chart";
import { TransactionTable } from "./components/TransactionTable";
import { BitcoinHolding, BitcoinPrice, BitcoinTransaction } from "./types";

// Mock data for now - replace with real data from your backend
const mockTransactions: BitcoinTransaction[] = [
  {
    date: "2024-01-15",
    amount: 1.5,
    priceUSD: 42000,
    priceEUR: 38500,
    totalUSD: 63000,
    totalEUR: 57750,
  },
  {
    date: "2024-02-01",
    amount: 2.0,
    priceUSD: 43000,
    priceEUR: 39500,
    totalUSD: 86000,
    totalEUR: 79000,
  },
];

function App() {
  const [priceData, setPriceData] = useState<BitcoinPrice[]>([]);
  const [holdings, setHoldings] = useState<BitcoinHolding>({
    totalBitcoin: 3.5,
    valueUSD: 0,
    valueEUR: 0,
    pnlPercentage: 0,
    pnlUSD: 0,
    pnlEUR: 0,
  });

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur"
        );
        
        const currentPrice: BitcoinPrice = {
          usd: response.data.bitcoin.usd,
          eur: response.data.bitcoin.eur,
          timestamp: Date.now(),
        };

        // Calculate current holdings value and PNL
        const currentValueUSD = holdings.totalBitcoin * currentPrice.usd;
        const currentValueEUR = holdings.totalBitcoin * currentPrice.eur;
        
        const totalInvestedUSD = mockTransactions.reduce((sum, t) => sum + t.totalUSD, 0);
        const totalInvestedEUR = mockTransactions.reduce((sum, t) => sum + t.totalEUR, 0);
        
        const pnlUSD = currentValueUSD - totalInvestedUSD;
        const pnlEUR = currentValueEUR - totalInvestedEUR;
        const pnlPercentage = (pnlUSD / totalInvestedUSD) * 100;

        setHoldings({
          ...holdings,
          valueUSD: currentValueUSD,
          valueEUR: currentValueEUR,
          pnlUSD,
          pnlEUR,
          pnlPercentage,
        });

        // For demo purposes, create some historical price data
        const historicalData: BitcoinPrice[] = [];
        const startDate = new Date("2024-01-01").getTime();
        for (let i = 0; i < 60; i++) {
          const timestamp = startDate + i * 24 * 60 * 60 * 1000;
          historicalData.push({
            timestamp,
            usd: 40000 + Math.random() * 10000,
            eur: 37000 + Math.random() * 9000,
          });
        }
        setPriceData(historicalData);
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    };

    fetchPriceData();
    const interval = setInterval(fetchPriceData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 py-8 space-y-8">
      <Header holdings={holdings} />
      <Chart priceData={priceData} transactions={mockTransactions} />
      <TransactionTable transactions={mockTransactions} />
    </div>
  );
}

export default App;
