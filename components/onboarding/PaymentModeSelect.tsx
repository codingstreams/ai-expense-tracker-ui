import { CreditCard, Wallet, Landmark, Coins } from 'lucide-react';

interface ModeProps {
  selectedModes: string[];
  onToggle: (id: string) => void;
}

const modes = [
  { id: 'card', name: 'Card', icon: <CreditCard /> },
  { id: 'upi', name: 'UPI', icon: <Coins /> },
  { id: 'cash', name: 'Cash', icon: <Wallet /> },
  { id: 'net', name: 'Net Banking', icon: <Landmark /> },
];

export const PaymentModeSelect = ({ selectedModes, onToggle }: ModeProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {modes.map((mode) => (
      <button
        key={mode.id}
        onClick={() => onToggle(mode.id)}
        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${selectedModes.includes(mode.id)
            ? 'border-purple-600 bg-purple-600/10 text-purple-400'
            : 'border-slate-800 bg-slate-800/20 text-slate-500 hover:border-slate-700'
          }`}
      >
        {mode.icon}
        <span className="font-semibold text-sm">{mode.name}</span>
      </button>
    ))}
  </div>
);