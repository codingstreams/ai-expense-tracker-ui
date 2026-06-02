'use client'

import { Sparkles, Send, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "../../api/api-client";

interface PromptInputProps {
  onProcess: (query: string) => void;
  onManualEntry: () => void;
}

const placeholders = [
  "Eg: spent 2000 on groceries today at Zepto",
  "Eg: received 50000 salary from office",
  "Eg: paid 1500 electricity bill using Net Banking",
  "Eg: spent 500 on dinner at Zomato using Credit Card",
  "Eg: transfer 2000 from Savings to ICICI Card",
];

export default function AiInput({ onProcess, onManualEntry }: PromptInputProps) {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      await apiFetch("/api/ai-input", {
        method: "POST",
        body: JSON.stringify({ rawText: query }),
      });
      onProcess(query);
      setQuery("");
    } catch (error) {
      console.error("Failed to process AI input:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Subtle Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/40 to-pink-600/40 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition duration-500"></div>

      <div className="relative bg-[#0f172a] border border-slate-800/80 rounded-2xl p-2.5 shadow-xl transition-all duration-300 group-focus-within:border-purple-500/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex items-center justify-center pl-4 text-purple-500 transition-transform duration-300 group-focus-within:scale-110">
            <Sparkles size={20} className={loading ? "animate-pulse" : ""} />
          </div>

          <input
            type="text"
            value={query}
            disabled={loading}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-slate-200 placeholder:text-slate-500 text-lg disabled:opacity-50 transition-all duration-300"
            placeholder={placeholders[placeholderIndex]}
          />

          <button
            type="button"
            onClick={onManualEntry}
            disabled={loading}
            className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 disabled:opacity-50"
            title="Manual Entry"
          >
            <SlidersHorizontal size={20} />
          </button>

          {/* AI Process Button */}
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-500/10 disabled:shadow-none"
          >
            {loading ? (
              <>
                <span className="hidden md:inline">Processing</span>
                <Loader2 size={18} className="animate-spin" />
              </>
            ) : (
              <>
                <span className="hidden md:inline">Process</span>
                <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}