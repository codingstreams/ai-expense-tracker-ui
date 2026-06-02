"use client";
import { Globe } from "lucide-react";

interface LanguageSettingsProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const LanguageSettings = ({ currentLanguage, onLanguageChange }: LanguageSettingsProps) => (
  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
    <div className="flex items-center gap-3 mb-6">
      <Globe className="text-purple-400" size={20} />
      <h3 className="text-white font-semibold">Language Preferences</h3>
    </div>
    <div className="flex gap-4">
      {['English', 'Hindi'].map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={`px-6 py-2 rounded-xl border transition-all ${
            currentLanguage === lang
              ? 'border-purple-500 bg-purple-500/10 text-white'
              : 'border-slate-700 hover:border-purple-500 text-slate-300 hover:text-white bg-slate-800/40'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  </div>
);