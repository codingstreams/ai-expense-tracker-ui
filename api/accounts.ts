import { apiFetch } from "./api-client";
import { Account } from "./model/Account";

export async function getAccounts(): Promise<Account[]> {
  try {
    const data = await apiFetch("/api/accounts", { method: "GET" });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    return [];
  }
}
