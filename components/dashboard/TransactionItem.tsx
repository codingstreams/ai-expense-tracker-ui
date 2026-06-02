import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';

interface TransactionProps {
  description: string;
  amount: number;
  type: string;
  transactionDate: string;
}

export const TransactionItem = ({ description, amount, type, transactionDate }: TransactionProps) => {
  // Format transaction date safely
  const formattedDate = () => {
    try {
      // Backend transactionDate might be in DD-MM-YYYY format
      if (transactionDate.includes('-')) {
        const parts = transactionDate.split('-');
        if (parts.length === 3) {
          // If in DD-MM-YYYY
          if (parts[0].length === 2 && parts[2].length === 4) {
            const dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            return dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
          }
        }
      }
      return new Date(transactionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return transactionDate;
    }
  };

  return (
    <div className="flex justify-between items-center p-3.5 hover:bg-slate-800/40 border border-transparent hover:border-slate-800/50 rounded-2xl transition-all duration-300 group cursor-pointer active:scale-[0.99]">
      <div className="flex gap-4 items-center">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
            type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 
            type === 'TRANSFER' ? 'bg-blue-500/10 text-blue-500' :
            'bg-rose-500/10 text-rose-500'
          }`}>
          {type === 'INCOME' ? <ArrowDownLeft size={18} /> : type === 'TRANSFER' ? <ArrowRightLeft size={18} /> : <ArrowUpRight size={18} />}
        </div>
        <div className="transform group-hover:translate-x-1 transition-transform duration-300">
          <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{description}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{formattedDate()}</p>
        </div>
      </div>
      <p className={`text-sm font-bold font-mono ${
        type === 'INCOME' ? 'text-emerald-400' : 
        type === 'TRANSFER' ? 'text-blue-400' : 
        'text-rose-400'
      }`}>
        {type === 'INCOME' ? '+' : type === 'TRANSFER' ? '' : '-'} ₹{amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};