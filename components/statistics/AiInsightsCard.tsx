import { Sparkles, BrainCircuit } from "lucide-react";
import { AiInsight } from "@/api/analytics";

interface AiInsightsCardProps {
  insight?: AiInsight;
}

export function AiInsightsCard({ insight }: AiInsightsCardProps) {
  // Zero-dependency Markdown rendering helper for insightText
  const renderInsightText = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          let cleanLine = line.trim();
          if (!cleanLine) return null;

          const isBullet = cleanLine.startsWith("-") || cleanLine.startsWith("*");
          if (isBullet) {
            cleanLine = cleanLine.substring(1).trim();
          }

          const parts = cleanLine.split(/\*\*(.*?)\*\*/g);
          const renderedContent = parts.map((part, i) => {
            if (i % 2 === 1) {
              return <strong key={i} className="text-purple-400 font-semibold">{part}</strong>;
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex gap-2 items-start pl-2">
                <span className="text-purple-500 mt-1.5">•</span>
                <span>{renderedContent}</span>
              </div>
            );
          }
          return <p key={idx}>{renderedContent}</p>;
        })}
      </div>
    );
  };

  if (!insight) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 h-full">
        <BrainCircuit size={32} className="text-slate-600 mb-3 animate-pulse" />
        <p className="text-slate-400 text-sm font-medium">No insights generated yet</p>
        <p className="text-slate-600 text-xs mt-1 max-w-[280px]">
          Our AI engine periodically scans your spending logs to generate alerts and savings ideas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-5 bg-purple-500/10 border border-purple-500/20 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-purple-500/20">
          <BrainCircuit size={48} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-purple-500/20 rounded-lg text-purple-400">
            <Sparkles size={16} />
          </div>
          <p className="text-purple-400 text-sm font-semibold tracking-wide uppercase">AI Spending Analysis</p>
        </div>
        {renderInsightText(insight.insightText)}
      </div>
    </div>
  );
}
