'use client'

import { useState } from "react";
import { Transaction } from "@/api/model/Transaction";
import { TransactionItem } from "./TransactionItem";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecentActivityProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function RecentActivity({ transactions, loading }: RecentActivityProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXPENSE' | 'INCOME' | 'TRANSFER'>('ALL');

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'ALL') return true;
    return tx.type === activeTab;
  });

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm rounded-3xl p-6 h-full flex flex-col">
      {/* Header with Tab Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full">
        <div className="flex justify-between items-center w-full sm:w-auto gap-4">
          <div className="space-y-1">
            <h3 className="text-slate-400 font-semibold tracking-wide text-sm uppercase">Recent Activity</h3>
            <p className="text-[11px] text-slate-500">Filters transactions by types</p>
          </div>
          <Link
            href="/transactions"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all border border-purple-500/10 active:scale-95"
          >
            View All
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Filtering Tabs */}
        <div className="p-1 bg-slate-950 rounded-xl flex border border-slate-800 text-xs">
          {(['ALL', 'EXPENSE', 'INCOME', 'TRANSFER'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 font-bold rounded-lg capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-slate-850 text-purple-400 shadow-sm border border-purple-500/10' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-1 overflow-hidden flex-1">
        {loading ? (
          // Skeleton Loader
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 w-full bg-slate-800/20 animate-pulse rounded-2xl" />
          ))
        ) : filteredTransactions.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-1">
            <p className="text-sm font-semibold">No {activeTab === 'ALL' ? '' : activeTab.toLowerCase()} transactions</p>
            <p className="text-xs text-slate-600">Try creating one using manual entry or AI input</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionItem key={tx.transactionId} {...tx} />
          ))
        )}
      </div>
    </div>
  );
}
