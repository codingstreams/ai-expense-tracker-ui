import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';

interface TransactionProps {
  description: string;
  amount: number;
  type: string;
  transactionDate: string;
}

export const TransactionItem = ({ description, amount, type, transactionDate }: TransactionProps) => (
  <div className="flex justify-between items-center p-3 hover:bg-slate-800/50 rounded-2xl transition-colors group">
    <div className="flex gap-4 items-center">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 
          type === 'TRANSFER' ? 'bg-blue-500/10 text-blue-500' :
          'bg-red-500/10 text-red-500'
        }`}>
        {type === 'INCOME' ? <ArrowDownLeft size={20} /> : type === 'TRANSFER' ? <ArrowRightLeft size={20} /> : <ArrowUpRight size={20} />}
      </div>
      <div>
        <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">{description}</p>
        <p className="text-xs text-slate-500">{new Date(transactionDate).toLocaleDateString()}</p>
      </div>
    </div>
    <p className={`text-sm font-bold ${type === 'INCOME' ? 'text-emerald-400' : type === 'TRANSFER' ? 'text-blue-400' : 'text-red-400'}`}>
      ₹ {amount}
    </p>
  </div>
);