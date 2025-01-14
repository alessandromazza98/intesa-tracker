import { Card } from "@tremor/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BitcoinPrice, BitcoinTransaction } from "../types";

interface ChartProps {
  priceData: BitcoinPrice[];
  transactions: BitcoinTransaction[];
}

export function Chart({ priceData, transactions }: ChartProps) {
  const data = priceData.map((price) => ({
    timestamp: price.timestamp,
    price: price.usd,
    isPurchase: transactions.some(
      (t) => new Date(t.date).getTime() === price.timestamp
    ),
  }));

  // Function to determine interval based on screen width
  const getResponsiveInterval = () => {
    if (typeof window === 'undefined') return 15;
    return window.innerWidth < 768 ? 15 : 7; // 15 days for mobile (about 2 per month), 7 days for desktop
  };

  return (
    <Card className="bg-blue-950 rounded-xl shadow-lg shadow-blue-900/20 border border-blue-800/50">
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
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
              fontSize={12}
              interval={getResponsiveInterval()}
              tickMargin={10}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
              stroke="#94a3b8"
              fontSize={12}
              tickMargin={10}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-blue-900/90 p-2 rounded-lg shadow-lg border border-blue-700">
                    <p className="text-blue-200 text-xs">
                      {new Date(data.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-white font-bold text-sm">
                      ${Math.round(data.price).toLocaleString()}
                    </p>
                    {data.isPurchase && (
                      <p className="text-green-400 font-bold text-xs">Purchase</p>
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
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (!payload.isPurchase) {
                  return <circle key={`dot-${payload.timestamp}`} cx={0} cy={0} r={0} fill="none" />;
                }
                return (
                  <circle
                    key={`dot-${payload.timestamp}`}
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#22c55e"
                    stroke="#fff"
                    strokeWidth={2}
                    filter="url(#glow)"
                  />
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 