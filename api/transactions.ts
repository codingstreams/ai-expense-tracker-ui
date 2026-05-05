import { apiFetch } from "./api-client";
import { Transaction } from "./model/Transaction";

export async function getTransations(): Promise<Transaction[]> {
  const transactions: Transaction[] = await apiFetch("/api/transactions/recent", { method: 'GET' })

  return transactions
}

