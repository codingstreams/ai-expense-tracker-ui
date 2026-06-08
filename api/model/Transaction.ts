export interface Transaction {
  transactionId: string;
  type: string;
  description: string;
  amount: number;
  transactionDate: string;
  transferId: string | null;
}