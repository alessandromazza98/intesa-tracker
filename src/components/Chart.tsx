import { Card } from "@tremor/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BitcoinPrice, BitcoinTransaction } from "../types";

interface ChartProps {
  priceData: BitcoinPrice[];
  transactions: BitcoinTransaction[];
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (!payload.isPurchase) {
    return <circle cx={cx} cy={cy} r={0} />;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={10}
      fill="#22c55e"
      stroke="#fff"
      strokeWidth={3}
      filter="url(#glow)"
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
    <Card className="w-full max-w-6xl mx-auto p-6 bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 60, right: 20, top: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              stroke="#94a3b8"
              interval={7}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis
              tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
              stroke="#94a3b8"
              width={80}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-blue-900/90 p-3 rounded-lg shadow-lg border border-blue-700">
                    <p className="text-blue-200 text-sm">
                      {new Date(data.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-white font-bold text-lg">
                      ${Math.round(data.price).toLocaleString()}
                    </p>
                    {data.isPurchase && (
                      <p className="text-green-400 font-bold">Purchase</p>
                    )}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#60a5fa"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              dot={CustomDot}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 