import { apiFetch } from "./api-client";

export interface DailyCashFlow {
  transactionDate: string; // "YYYY-MM-DD"
  income: number;
  expense: number;
}

export interface MonthlyCashFlow {
  year: number;
  month: number;
  income: number;
  expense: number;
}

export interface CategoryDistribution {
  label: string;
  amount: number;
  limit: number;
}

export interface AiInsight {
  id: number;
  type: string;
  insightText: string;
  createdAt: number;
  status: string;
}

export async function getDailyCashFlow(startDate: string, endDate: string): Promise<DailyCashFlow[]> {
  try {
    const data = await apiFetch(`/api/analytics/cashflow/daily?startDate=${startDate}&endDate=${endDate}`, {
      method: "GET",
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch daily cash flow:", error);
    return [];
  }
}

export async function getMonthlyCashFlow(startDate: string, endDate: string): Promise<MonthlyCashFlow[]> {
  try {
    const data = await apiFetch(`/api/analytics/cashflow/monthly?startDate=${startDate}&endDate=${endDate}`, {
      method: "GET",
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch monthly cash flow:", error);
    return [];
  }
}

export async function getCategoryDistribution(startDate: string, endDate: string): Promise<CategoryDistribution[]> {
  try {
    const data = await apiFetch(`/api/analytics/category-distribution?startDate=${startDate}&endDate=${endDate}`, {
      method: "GET",
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch category distribution:", error);
    return [];
  }
}

export async function getAiInsights(): Promise<AiInsight[]> {
  try {
    const data = await apiFetch("/api/analytics/insights", {
      method: "GET",
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch AI insights:", error);
    return [];
  }
}
