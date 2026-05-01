'use client'

import AiInput from "@/components/dashboard/AiInput";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import WalletCard from "@/components/dashboard/WalletCard";
import WeeklyGraphTrend from "@/components/dashboard/WeeklyGraphTrend";
import { useEffect, useState } from "react";
import { Transaction } from "@/api/model/Transaction";
import { getTransations } from "@/api/transactions";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { CategorySpend } from "@/components/dashboard/CategorySpend";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTransations().then(txns => { setLoading(false); setTransactions(txns) });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20">
      {/* gradient background with blur at top right and bottom left */}
      <div className="absolute -z-10 w-[32rem] h-[32rem] top-0 right-0 bg-gradient-to-br from-purple-500/30 to-pink-500/10 blur-[100px] z-0" />
      <div className="absolute -z-10 w-[32rem] h-[32rem] bottom-0 left-0 bg-gradient-to-br from-blue-500/30 to-indigo-500/10 blur-[100px] z-0" />


      <section className="space-y-6">
        <DashboardHeader subtitle="Welcome back" title="Good Evening, hope you're doing fine!" />

        <AiInput
          onProcess={() => { }}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl h-[300px]">
          <WeeklyGraphTrend data={[
            { day: 'Mon', spent: 1200 },
            { day: 'Tue', spent: 900 },
            { day: 'Wed', spent: 2200 },
            { day: 'Thu', spent: 400 },
            { day: 'Fri', spent: 1800 },
            { day: 'Sat', spent: 3500 },
            { day: 'Sun', spent: 2100 },
          ]} />
        </div>
        <div className="lg:col-span-4">
          <WalletCard
            title="Total Account Balance"
            balance={21000}
          />

          <div className="mt-6 grid grid-cols-2 gap-6">
            <WalletCard
              title="Monthly Expenses"
              balance={10000}
            />
            <WalletCard
              title="Savings"
              balance={11000}
            />
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-full flex flex-col">
            {/* Header with View All Button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-400 font-medium tracking-wide">Recent Activity</h3>
              <button
                onClick={() => console.log("Navigate to Transactions")}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3 py-1.5 rounded-lg transition-all border border-purple-500/20"
              >
                View All
              </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-1 overflow-hidden">
              {loading ? (
                // Skeleton Loader
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 w-full bg-slate-800/20 animate-pulse rounded-2xl" />
                ))
              ) : (
                transactions.map((tx) => (
                  <TransactionItem key={tx.id} {...tx} />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-full flex flex-col">
            <h3 className="text-slate-400 font-bold tracking-wide mb-4">Category-wise Spend</h3>
            <CategorySpend />
          </div>
        </div>

      </div>

    </div>
  )
}

export default DashboardPage;

