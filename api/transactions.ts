import { apiFetch } from "./api-client";
import { Transaction } from "./model/Transaction";

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  types?: string[];
  categoryIds?: number[];
  accountIds?: number[];
  paymentModeIds?: number[];
  search?: string;
}

export async function getTransations(): Promise<Transaction[]> {
  try {
    const transactions = await apiFetch("/api/transactions/recent", { method: 'GET' })
    return Array.isArray(transactions) ? transactions : []
  } catch (error) {
    console.error("Failed to fetch transactions from backend:", error);
    return []
  }
}

export async function getPaginatedTransactions(
  page: number = 0,
  size: number = 10,
  sortBy: string = 'transactionDate',
  sortDirection: string = 'DESC',
  filters: TransactionFilters = {}
): Promise<PaginatedResponse<Transaction>> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', `${sortBy},${sortDirection}`);

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.minAmount !== undefined && filters.minAmount !== null) {
      params.append('minAmount', filters.minAmount.toString());
    }
    if (filters.maxAmount !== undefined && filters.maxAmount !== null) {
      params.append('maxAmount', filters.maxAmount.toString());
    }
    
    if (filters.types && filters.types.length > 0) {
      filters.types.forEach(t => params.append('types', t));
    }
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach(id => params.append('categoryIds', id.toString()));
    }
    if (filters.accountIds && filters.accountIds.length > 0) {
      filters.accountIds.forEach(id => params.append('accountIds', id.toString()));
    }
    if (filters.paymentModeIds && filters.paymentModeIds.length > 0) {
      filters.paymentModeIds.forEach(id => params.append('paymentModeIds', id.toString()));
    }
    if (filters.search) params.append('search', filters.search);

    const url = `/api/transactions?${params.toString()}`;
    return await apiFetch(url, { method: 'GET' });
  } catch (error) {
    console.error("Failed to fetch paginated transactions:", error);
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size,
      number: page,
      first: true,
      last: true,
      empty: true
    };
  }
}

