import { Card, Metric, Text } from "@tremor/react";
import { BitcoinHolding } from "../types";

interface HeaderProps {
  holdings: BitcoinHolding;
}

export function Header({ holdings }: HeaderProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Intesa Sanpaolo Bitcoin Holdings Tracker
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-950">
          <Text>Total Bitcoin</Text>
          <Metric>{holdings.totalBitcoin.toFixed(2)} BTC</Metric>
        </Card>
        
        <Card className="bg-blue-950">
          <Text>Current Value</Text>
          <div className="space-y-1">
            <Metric>${holdings.valueUSD.toLocaleString()}</Metric>
            <Text>€{holdings.valueEUR.toLocaleString()}</Text>
          </div>
        </Card>
        
        <Card className="bg-blue-950">
          <Text>Profit/Loss</Text>
          <div className="space-y-1">
            <Metric className={holdings.pnlPercentage >= 0 ? "text-green-500" : "text-red-500"}>
              {holdings.pnlPercentage >= 0 ? "+" : ""}{holdings.pnlPercentage.toFixed(2)}%
            </Metric>
            <Text className={holdings.pnlUSD >= 0 ? "text-green-500" : "text-red-500"}>
              ${holdings.pnlUSD.toLocaleString()}
            </Text>
            <Text className={holdings.pnlEUR >= 0 ? "text-green-500" : "text-red-500"}>
              €{holdings.pnlEUR.toLocaleString()}
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
} 