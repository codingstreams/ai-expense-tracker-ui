import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";

interface WeeklyData {
  day: string;
  spent: number;
}

export default function WeeklyGraphTrend({ data }: { data: WeeklyData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            color: '#f8fafc'
          }}
          itemStyle={{ color: '#a78bfa' }}
          cursor={{ stroke: '#4b5563', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="spent"
          stroke="#8b5cf6"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSpent)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}