interface AccountProps {
  bankName: string;
  lastFour: string;
  type: 'Savings' | 'Credit' | 'Cash';
  amount: number; // Balance for Savings, Limit for Credit
}

export const AccountCard = ({ bankName, lastFour, type, amount }: AccountProps) => (
  <div className="p-5 bg-slate-800/30 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-slate-700 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-purple-400">
        {bankName[0]}
      </div>
      <div>
        <p className="text-white font-medium">{bankName}</p>
        <p className="text-xs text-slate-500">•••• {lastFour}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs text-slate-500 uppercase tracking-wider">{type === 'Credit' ? 'Limit' : 'Balance'}</p>
      <p className="text-lg font-bold text-white">₹{amount.toLocaleString()}</p>
    </div>
  </div>
);