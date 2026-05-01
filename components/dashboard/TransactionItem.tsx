import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionProps {
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export const TransactionItem = ({ title, category, amount, type, date }: TransactionProps) => (
  <div className="flex justify-between items-center p-3 hover:bg-slate-800/50 rounded-2xl transition-colors group">
    <div className="flex gap-4 items-center">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
        }`}>
        {type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
      </div>
      <div>
        <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">{title}</p>
        <p className="text-xs text-slate-500">{category} • {date}</p>
      </div>
    </div>
    <p className={`text-sm font-bold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
      {type === 'income' ? '+' : '-'}₹{amount}
    </p>
  </div>
);