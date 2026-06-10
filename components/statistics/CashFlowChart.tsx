import { 
  ResponsiveContainer, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area 
} from "recharts";
import { DailyCashFlow, MonthlyCashFlow } from "@/api/analytics";

interface CashFlowChartProps {
  data: (DailyCashFlow | (MonthlyCashFlow & { period?: string }))[];
  range: "7d" | "30d" | "12m";
}

export function CashFlowChart({ data, range }: CashFlowChartProps) {
  // Helper to format X-Axis labels dynamically
  const formatXAxis = (tickItem: any) => {
    if (range === "12m") {
      return tickItem.period || "";
    }
    try {
      const date = new Date(tickItem.transactionDate);
      if (range === "7d") {
        return date.toLocaleDateString("en-US", { weekday: "short" });
      }
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  if (data.length === 0) {
    return (
      <div className="w-full h-full bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
        No cash flow records found for this period.
      </div>
    );
  }

  return (
    <div className="w-full h-[360px] min-h-0 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey={range === "12m" ? "period" : undefined}
            tickFormatter={range !== "12m" ? (_, index) => formatXAxis(data[index]) : undefined}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              color: "#f8fafc"
            }}
            itemStyle={{ fontSize: 12 }}
            cursor={{ stroke: "#4b5563", strokeWidth: 1.5 }}
          />
          <Area
            type="monotone"
            name="Income"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorIncome)"
            animationDuration={1000}
          />
          <Area
            type="monotone"
            name="Expense"
            dataKey="expense"
            stroke="#f43f5e"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorExpense)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
