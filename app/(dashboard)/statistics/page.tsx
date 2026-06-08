import { CategorySpend } from "@/components/dashboard/CategorySpend";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AnalyticsCard } from "@/components/statistics/AnalyticsCard";
import { StatCard } from "@/components/statistics/StatCard";



export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20 animate-slide-up">
      <DashboardHeader title="Analytics" subtitle="Track your spending and income" />

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Spent" value="₹42,000" trend="-4%" trendType="positive" />
        <StatCard label="Avg. Daily" value="₹1,400" />
        <StatCard label="Top Category" value="Food" />
        <StatCard label="AI Savings Tip" value="₹2.1k" trend="Saved" trendType="positive" />
      </div>

      {/* Detailed Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Large Line/Area Chart */}
        <div className="lg:col-span-12">
          <AnalyticsCard title="Cash Flow (Income vs Expense)" height="h-[450px]">
            <div className="w-full h-full bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-600">

              {/* When you record, this is where you'd implement Recharts AreaChart */}
            </div>
          </AnalyticsCard>
        </div>

        {/* Breakdown Row */}
        <div className="lg:col-span-6">
          <AnalyticsCard title="Category Distribution" height="h-full">
            <CategorySpend />
          </AnalyticsCard>
        </div>

        <div className="lg:col-span-6">
          <AnalyticsCard title="Spending Insights (AI Generated)" height="h-full">
            <div className="space-y-4">
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <p className="text-purple-400 text-sm font-semibold">💡 AI Insight</p>
                <p className="text-slate-300 text-sm mt-1">Your weekend spending on Food is 40% higher than weekdays.</p>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <p className="text-blue-400 text-sm font-semibold">📈 Trend Alert</p>
                <p className="text-slate-300 text-sm mt-1">Subscription costs increased by ₹499 this month (Netflix). Check if you're still using all active services.</p>
              </div>
            </div>
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
}