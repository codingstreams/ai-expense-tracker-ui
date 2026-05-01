'use client'

import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

interface PromptInputProps {
  onProcess: (query: string) => void;
}

export default function AiInput({ onProcess }: PromptInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onProcess(query);
  };


  return (
    <div className="relative group">
      {/* Subtle Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>

      <div className="relative bg-[#0f172a] border border-slate-800 rounded-2xl p-2 shadow-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex items-center justify-center pl-4 text-purple-500">
            <Sparkles size={20} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-slate-200 placeholder:text-slate-500 text-lg"
            placeholder="Eg: spent 2000 on groceries today at Zepto"
          />

          {/* AI Process Button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
          >
            <span className="hidden md:inline">Process</span>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}