import { Card } from "@tremor/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BitcoinPrice, BitcoinTransaction } from "../types";

interface ChartProps {
  priceData: BitcoinPrice[];
  transactions: BitcoinTransaction[];
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
}

const CustomDot = ({ cx, cy }: CustomDotProps) => {
  if (!cx || !cy) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill="#22c55e"
      stroke="#fff"
      strokeWidth={2}
    />
  );
};

export function Chart({ priceData, transactions }: ChartProps) {
  const data = priceData.map((price) => ({
    timestamp: price.timestamp,
    price: price.usd,
    isPurchase: transactions.some(
      (t) => new Date(t.date).getTime() === price.timestamp
    ),
  }));

  return (
    <Card className="w-full max-w-6xl mx-auto p-4 bg-blue-950">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
              stroke="#fff"
            />
            <YAxis
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              stroke="#fff"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-blue-900 p-2 rounded shadow">
                    <p className="text-white">
                      {new Date(data.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-white font-bold">
                      ${data.price.toLocaleString()}
                    </p>
                    {data.isPurchase && (
                      <p className="text-green-500 font-bold">Purchase</p>
                    )}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorPrice)"
              dot={(props) => (props.payload.isPurchase ? <CustomDot {...props} /> : null)}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 