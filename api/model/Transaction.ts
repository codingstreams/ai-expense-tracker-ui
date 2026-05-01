export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'expense' | 'income';
  date: string;
}
