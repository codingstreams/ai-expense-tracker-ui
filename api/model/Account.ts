export interface Account {
  id: string;
  bankName: string;
  lastFour: string;
  type: 'Savings' | 'Credit' | 'Cash';
  amount: number;
}