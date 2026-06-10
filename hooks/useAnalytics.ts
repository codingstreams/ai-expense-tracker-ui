import { useState, useEffect } from "react";
import { 
  getDailyCashFlow, 
  getMonthlyCashFlow, 
  getCategoryDistribution, 
  getAiInsights, 
  DailyCashFlow, 
  MonthlyCashFlow, 
  CategoryDistribution, 
  AiInsight 
} from "@/api/analytics";

export type RangeType = "7d" | "30d" | "12m";

export function useAnalytics() {
  const [range, setRange] = useState<RangeType>("30d");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [cashFlowData, setCashFlowData] = useState<(DailyCashFlow | (MonthlyCashFlow & { period?: string }))[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [insights, setInsights] = useState<AiInsight[]>([]);

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const today = new Date();
      let startDateStr = "";
      const endDateStr = formatDate(today);

      if (range === "7d") {
        const past = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDateStr = formatDate(past);
      } else if (range === "30d") {
        const past = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDateStr = formatDate(past);
      } else {
        const past = new Date();
        past.setFullYear(past.getFullYear() - 1);
        past.setDate(1); // start of the month 12 months ago
        startDateStr = formatDate(past);
      }

      try {
        let cashFlowPromise;
        if (range === "12m") {
          cashFlowPromise = getMonthlyCashFlow(startDateStr, endDateStr);
        } else {
          cashFlowPromise = getDailyCashFlow(startDateStr, endDateStr);
        }

        const [cashFlow, categories, allInsights] = await Promise.all([
          cashFlowPromise,
          getCategoryDistribution(startDateStr, endDateStr),
          getAiInsights()
        ]);

        // Post-process cash flow data (absolute values, formatted periods)
        if (range === "12m") {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const formatted = (cashFlow as MonthlyCashFlow[]).map(item => ({
            ...item,
            period: `${monthNames[item.month - 1]} ${item.year % 100}`,
            income: Math.max(0, item.income),
            expense: Math.abs(item.expense)
          }));
          setCashFlowData(formatted);
        } else {
          const formatted = (cashFlow as DailyCashFlow[]).map(item => ({
            ...item,
            income: Math.max(0, item.income),
            expense: Math.abs(item.expense)
          }));
          setCashFlowData(formatted);
        }

        setCategoryData(categories);
        setInsights(allInsights);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [range]);

  // Key Metric Calculations
  const totalSpent = cashFlowData.reduce((sum, item) => sum + item.expense, 0);
  const totalIncome = cashFlowData.reduce((sum, item) => sum + item.income, 0);
  const netSavings = totalIncome - totalSpent;
  
  const avgSpent = totalSpent / (cashFlowData.length || 1);

  const topCategory = categoryData.reduce(
    (prev, curr) => (curr.amount > prev.amount ? curr : prev),
    { label: "N/A", amount: 0 }
  ).label;

  const activeInsight = insights.find(ins => ins.status === "COMPLETED");

  return {
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
  };
}
