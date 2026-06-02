
'use client'

import { Account } from "@/api/model/Account";
import { AccountCard } from "@/components/profile/AccountCard";
import { CategoryManager } from "@/components/profile/CategoryManager";
import { LanguageSettings } from "@/components/profile/LanguageSettings";
import { apiFetch } from "@/api/api-client";
import { CreditCard, Wallet, Landmark } from "lucide-react";
import { useEffect, useState } from "react";

interface UserConfig {
  language: string;
  defaultPaymentModeId: number;
}

export default function ProfilePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const accountsData = await apiFetch("/api/accounts", { method: "GET" });
        setAccounts(accountsData);
        
        const configData = await apiFetch("/api/user/config", { method: "GET" });
        setConfig(configData);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleUpdateLanguage = async (lang: string) => {
    try {
      const updated = await apiFetch("/api/user/config", {
        method: "PATCH",
        body: JSON.stringify({
          language: lang,
          defaultPaymentModeId: config?.defaultPaymentModeId ?? 1,
        }),
      });
      setConfig(updated);
    } catch (err) {
      console.error("Failed to update language:", err);
    }
  };

  const handleUpdatePaymentMode = async (modeId: number) => {
    try {
      const updated = await apiFetch("/api/user/config", {
        method: "PATCH",
        body: JSON.stringify({
          language: config?.language ?? "English",
          defaultPaymentModeId: modeId,
        }),
      });
      setConfig(updated);
    } catch (err) {
      console.error("Failed to update default payment mode:", err);
    }
  };

  const paymentModes = [
    { id: 1, name: 'Card', icon: <CreditCard size={18} /> },
    { id: 4, name: 'UPI', icon: <span className="text-[10px] font-bold">UPI</span> },
    { id: 5, name: 'Cash', icon: <Wallet size={18} /> },
    { id: 3, name: 'Net Banking', icon: <Landmark size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your preferences and linked accounts.</p>
      </header>

      {/* Preferences Section */}
      {config && (
        <LanguageSettings 
          currentLanguage={config.language} 
          onLanguageChange={handleUpdateLanguage} 
        />
      )}

      <div className="grid grid-cols-1 gap-8">
        <CategoryManager />


        {/* Payment Modes Selection */}
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <h3 className="text-white font-semibold mb-6">Default Payment Modes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentModes.map((mode) => {
              const isSelected = config?.defaultPaymentModeId === mode.id;
              return (
                <button
                  key={mode.name}
                  onClick={() => handleUpdatePaymentMode(mode.id)}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-slate-800 bg-slate-800/20 text-slate-400 hover:border-purple-500 hover:text-white'
                  }`}
                >
                  {mode.icon}
                  <span className="text-sm font-medium">{mode.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Linked Accounts & Cards */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-white font-semibold">Linked Accounts & Cards</h3>
          <button className="text-sm text-purple-400 font-medium hover:underline">+ Add New</button>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="h-20 w-full bg-slate-800/20 animate-pulse rounded-2xl" />
          ) : (
            accounts.map(acc => (
              <AccountCard key={acc.id} bankName={acc.bankName} lastFour={acc.lastFour} type={acc.type} amount={acc.amount} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}