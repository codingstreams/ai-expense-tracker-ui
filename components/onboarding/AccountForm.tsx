import { Trash2 } from 'lucide-react';

export const AccountForm = ({ acc, index, onUpdate, onRemove, showRemove }: any) => (
  <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl space-y-4 relative group transition-all hover:border-slate-700">
    <div className="flex justify-between items-center">
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onUpdate(index, 'type', 'Savings')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${acc.type === 'Savings' ? 'bg-purple-600 text-white' : 'text-slate-500'
            }`}
        >Savings</button>
        <button
          onClick={() => onUpdate(index, 'type', 'Credit')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${acc.type === 'Credit' ? 'bg-pink-600 text-white' : 'text-slate-500'
            }`}
        >Credit Card</button>
      </div>
      {showRemove && (
        <button onClick={() => onRemove(index)} className="text-slate-600 hover:text-red-400">
          <Trash2 size={18} />
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        placeholder="Bank/Card Name"
        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500"
        value={acc.bank}
        onChange={(e) => onUpdate(index, 'bank', e.target.value)}
      />
      <input
        placeholder="Last 4 Digits"
        maxLength={4}
        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500"
        value={acc.lastFour}
        onChange={(e) => onUpdate(index, 'lastFour', e.target.value)}
      />
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
        <input
          placeholder={acc.type === 'Credit' ? 'Limit' : 'Balance'}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-8 pr-4 text-sm outline-none focus:border-purple-500"
          value={acc.amount}
          onChange={(e) => onUpdate(index, 'amount', e.target.value)}
        />
      </div>
    </div>
  </div>
);