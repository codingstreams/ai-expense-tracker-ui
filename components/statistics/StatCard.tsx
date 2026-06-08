interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'positive' | 'negative';
}

export const StatCard = ({ label, value, trend, trendType }: StatCardProps) => (
  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors">
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
    <div className="flex items-baseline gap-2 mt-1">
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend && (
        <span className={`text-[10px] font-bold ${trendType === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);