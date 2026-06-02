import { ShoppingBag, Coffee, Clapperboard, Compass, AlertCircle } from 'lucide-react';

interface CategoryItemProps {
  label: string;
  amount: number;
  limit: number;
}

const CategoryRow = ({ label, amount, limit }: CategoryItemProps) => {
  const percentage = Math.min((amount / limit) * 100, 100);
  const remaining = limit - amount;
  const isOverspent = remaining < 0;

  // Determine progress bar and text color dynamically
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-rose-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-purple-500';
  };

  const getIcon = () => {
    switch (label.toLowerCase()) {
      case 'food & drinks':
      case 'food':
        return <Coffee size={16} className="text-purple-400" />;
      case 'entertainment':
        return <Clapperboard size={16} className="text-pink-400" />;
      case 'shopping':
        return <ShoppingBag size={16} className="text-blue-400" />;
      case 'travel':
        return <Compass size={16} className="text-cyan-400" />;
      default:
        return <ShoppingBag size={16} className="text-purple-400" />;
    }
  };

  return (
    <div className="space-y-2 p-3 hover:bg-slate-800/20 border border-transparent hover:border-slate-800/40 rounded-2xl transition-all duration-300">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-800/50 rounded-lg">
            {getIcon()}
          </div>
          <span className="text-slate-300 font-semibold">{label}</span>
        </div>
        <span className="text-slate-400 font-mono text-xs">
          ₹{amount.toLocaleString()} <span className="text-slate-600">/ ₹{limit.toLocaleString()}</span>
        </span>
      </div>

      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getProgressColor()} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px]">
        {isOverspent ? (
          <span className="text-rose-400 font-medium flex items-center gap-1">
            <AlertCircle size={10} /> ₹{Math.abs(remaining).toLocaleString()} over budget
          </span>
        ) : (
          <span className="text-slate-500 font-medium">
            ₹{remaining.toLocaleString()} left
          </span>
        )}
        <span className={`font-bold ${percentage >= 90 ? 'text-rose-400' : 'text-slate-500'}`}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export const CategorySpend = () => {
  const categories = [
    { label: "Food & Drinks", amount: 4500, limit: 6000 },
    { label: "Entertainment", amount: 1200, limit: 3000 },
    { label: "Shopping", amount: 9200, limit: 10000 },
    { label: "Travel", amount: 2000, limit: 2500 },
  ];

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <CategoryRow key={cat.label} {...cat} />
      ))}
    </div>
  );
};