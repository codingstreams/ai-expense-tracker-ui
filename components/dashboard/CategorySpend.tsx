interface CategoryItemProps {
  label: string;
  amount: number;
  limit: number;
  color: string;
}

const CategoryRow = ({ label, amount, limit, color }: CategoryItemProps) => {
  const percentage = Math.min((amount / limit) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-slate-400 font-mono">
          ₹{amount.toLocaleString()} <span className="text-slate-600"></span>
        </span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CategorySpend = () => {
  const categories = [
    { label: "Food & Drinks", amount: 4500, limit: 6000, color: "bg-purple-500" },
    { label: "Entertainment", amount: 1200, limit: 3000, color: "bg-pink-500" },
    { label: "Shopping", amount: 8000, limit: 10000, color: "bg-blue-500" },
    { label: "Travel", amount: 2000, limit: 2500, color: "bg-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <CategoryRow key={cat.label} {...cat} />
      ))}
    </div>
  );
};