import { Card, Metric, Text } from "@tremor/react";
import { BitcoinHolding } from "../types";

interface HeaderProps {
  holdings: BitcoinHolding;
}

export function Header({ holdings }: HeaderProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
        Intesa SanPaolo Bitcoin Holdings Tracker
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50">
          <Text className="text-blue-300">Total Bitcoin</Text>
          <Metric className="text-white">{holdings.totalBitcoin.toFixed(2)} BTC</Metric>
        </Card>
        
        <Card className="bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50">
          <Text className="text-blue-300">Current Value</Text>
          <div className="space-y-1">
            <Metric className="text-white">${holdings.valueUSD.toLocaleString()}</Metric>
            <Text className="text-blue-300">€{holdings.valueEUR.toLocaleString()}</Text>
          </div>
        </Card>
        
        <Card className="bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50">
          <Text className="text-blue-300">Profit/Loss USD</Text>
          <div className="space-y-1">
            <Metric className={holdings.pnlUSD >= 0 ? "text-green-400" : "text-red-400"}>
              ${holdings.pnlUSD.toLocaleString()}
            </Metric>
            <Text className={holdings.pnlPercentageUSD >= 0 ? "text-green-400" : "text-red-400"}>
              {holdings.pnlPercentageUSD >= 0 ? "+" : ""}{holdings.pnlPercentageUSD.toFixed(2)}%
            </Text>
          </div>
        </Card>

        <Card className="bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50">
          <Text className="text-blue-300">Profit/Loss EUR</Text>
          <div className="space-y-1">
            <Metric className={holdings.pnlEUR >= 0 ? "text-green-400" : "text-red-400"}>
              €{holdings.pnlEUR.toLocaleString()}
            </Metric>
            <Text className={holdings.pnlPercentageEUR >= 0 ? "text-green-400" : "text-red-400"}>
              {holdings.pnlPercentageEUR >= 0 ? "+" : ""}{holdings.pnlPercentageEUR.toFixed(2)}%
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
} 