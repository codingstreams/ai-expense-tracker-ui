import { TrendingUp, TrendingDown } from "lucide-react";

interface WalletProps {
  balance: number;
  title: string;
  theme?: 'purple' | 'glass' | 'emerald' | 'rose' | 'blue';
  trend?: {
    value: number;
    isUpward: boolean;
    label: string;
  };
}

export default function WalletCard({ balance, title, theme = 'purple', trend }: WalletProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'glass':
        return 'bg-slate-900/65 border border-slate-800/80 backdrop-blur-md text-white shadow-xl';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/10';
      case 'rose':
        return 'bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-lg shadow-rose-500/10';
      case 'blue':
        return 'bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-lg shadow-blue-500/10';
      case 'purple':
      default:
        return 'bg-gradient-to-br from-purple-500 to-indigo-700 text-white shadow-lg shadow-purple-500/10';
    }
  };

  return (
    <div className={`relative rounded-3xl p-6 flex flex-col justify-between overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer ${getThemeClasses()}`}>
      {/* Decorative Radial Grid / Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
      
      {/* Subtle abstract card glow circles */}
      {theme !== 'glass' && (
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div className="space-y-4 flex flex-col justify-between h-full">
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'glass' ? 'text-slate-400' : 'text-white/70'}`}>
            {title}
          </h3>
          <p className="text-3xl font-black tracking-tight mt-2">
            ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
        </div>

        {trend && (
          <div className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold ${
            trend.isUpward 
              ? (theme === 'glass' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/10 text-white')
              : (theme === 'glass' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-black/10 text-white/90')
          }`}>
            {trend.isUpward ? <TrendingUp size={14} className="shrink-0" /> : <TrendingDown size={14} className="shrink-0" />}
            <span>{trend.value}% {trend.label}</span>
          </div>
        )}
      </div>

      {/* Abstract card bottom accent lines */}
      <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${
        theme === 'glass' ? 'bg-gradient-to-r from-purple-500/50 to-pink-500/50' : 'bg-white/10'
      }`} />
    </div>
  );
}