import { Transaction } from "./model/Transaction";

export async function getTransations(): Promise<Transaction[]> {
  return [
    { id: '1', title: 'Zepto Grocery', category: 'Food', amount: 450, type: 'expense', date: 'Today' },
    { id: '2', title: 'Freelance Pay', category: 'Work', amount: 12000, type: 'income', date: 'Yesterday' },
    { id: '3', title: 'Apple Music', category: 'Ent.', amount: 99, type: 'expense', date: '2 days ago' },
    { id: '4', title: 'Starbucks', category: 'Food', amount: 350, type: 'expense', date: '3 days ago' },
  ];
}

