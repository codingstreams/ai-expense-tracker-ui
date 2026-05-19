import { apiFetch } from "./api-client";
import { Transaction } from "./model/Transaction";

export async function getTransations(): Promise<Transaction[]> {
  try {
    const transactions = await apiFetch("/api/transactions/recent", { method: 'GET' })
    return Array.isArray(transactions) ? transactions : []
  } catch (error) {
    console.error("Failed to fetch transactions from backend:", error);
    return []
  }
}

