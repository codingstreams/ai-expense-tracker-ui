"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { CategorySpend } from "@/components/dashboard/CategorySpend";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AnalyticsCard } from "@/components/statistics/AnalyticsCard";
import { StatCard } from "@/components/statistics/StatCard";
import { CashFlowChart } from "@/components/statistics/CashFlowChart";
import { AiInsightsCard } from "@/components/statistics/AiInsightsCard";
import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const {
    range,
    setRange,
    loading,
    cashFlowData,
    categoryData,
    totalSpent,
    avgSpent,
    topCategory,
    netSavings,
    activeInsight
  } = useAnalytics();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="max-w-7xl mx-auto p-6 lg:p-10 text-slate-500">Loading interface...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20 animate-slide-up relative">
      {/* Background Glow Orbs */}
      <div className="absolute -z-10 w-[32rem] h-[32rem] top-0 right-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute -z-10 w-[32rem] h-[32rem] bottom-0 left-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Header and Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DashboardHeader title="Analytics" subtitle="Track your spending and income" />

        {/* Range Select switcher */}
        <div className="p-1 bg-slate-950 rounded-xl flex border border-slate-800 text-xs shadow-md">
          {(["7d", "30d", "12m"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 font-bold rounded-lg transition-all ${
                range === r
                  ? "bg-slate-850 text-purple-400 shadow-sm border border-purple-500/10"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "12 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse" />
          ))
        ) : (
          <>
            <StatCard 
              label="Total Spent" 
              value={`₹${Math.round(totalSpent).toLocaleString()}`} 
              trend={range === "7d" ? "Last 7 Days" : range === "30d" ? "Last 30 Days" : "Last 12 Months"} 
              trendType="positive" 
            />
            <StatCard 
              label={range === "12m" ? "Avg. Monthly" : "Avg. Daily"} 
              value={`₹${Math.round(avgSpent).toLocaleString()}`} 
            />
            <StatCard 
              label="Top Category" 
              value={topCategory} 
            />
            <StatCard 
              label="Net Savings" 
              value={`₹${Math.round(netSavings).toLocaleString()}`} 
              trend={netSavings >= 0 ? "Surplus" : "Deficit"} 
              trendType={netSavings >= 0 ? "positive" : "negative"} 
            />
          </>
        )}
      </div>

      {/* Detailed Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Large Line/Area Chart */}
        <div className="lg:col-span-12">
          <AnalyticsCard title="Cash Flow (Income vs Expense)" height="h-[450px]">
            {loading ? (
              <div className="w-full h-full bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-600 animate-pulse">
                Loading Cash Flow Data...
              </div>
            ) : (
              <CashFlowChart data={cashFlowData} range={range} />
            )}
          </AnalyticsCard>
        </div>

        {/* Breakdown Row */}
        <div className="lg:col-span-6">
          <AnalyticsCard title="Category Distribution" height="h-full">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <CategorySpend data={categoryData} />
            )}
          </AnalyticsCard>
        </div>

        <div className="lg:col-span-6">
          <AnalyticsCard title="Spending Insights (AI Generated)" height="h-full">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
              </div>
            ) : (
              <AiInsightsCard insight={activeInsight} />
            )}
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
}