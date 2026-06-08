interface AnalyticsCardProps {
  title: string;
  children: React.ReactNode;
  height?: string;
}

export const AnalyticsCard = ({ title, children, height = "h-[300px]" }: AnalyticsCardProps) => (
  <div className={`${height} bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm`}>
    <h3 className="text-slate-400 font-medium mb-6 tracking-wide">{title}</h3>
    <div className="w-full h-[calc(100%-2rem)]">
      {children}
    </div>
  </div>
);

