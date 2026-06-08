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
import { ManualEntryModal } from "@/components/dashboard/ManualEntryModal";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXPENSE' | 'INCOME' | 'TRANSFER'>('ALL');
  const [greeting, setGreeting] = useState("Hello");

  const fetchTransactions = () => {
    getTransations().then(txns => { 
      setTransactions(txns);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTransactions();

    const hour = new Date().getHours();
    let dynamicGreeting = "Good Evening";
    if (hour >= 5 && hour < 12) dynamicGreeting = "Good Morning";
    else if (hour >= 12 && hour < 17) dynamicGreeting = "Good Afternoon";
    else dynamicGreeting = "Good Evening";
    setGreeting(dynamicGreeting);
  }, []);

  // Dynamic calculations based on transaction list
  const incomeSum = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const expenseSum = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  
  const totalBalance = Math.max(21000 + incomeSum - expenseSum, 0);
  const savingsBalance = 11000 + incomeSum * 0.4; // 40% of income goes to savings mock
  const monthlyExpenses = 10000 + expenseSum;

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'ALL') return true;
    return tx.type === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20 animate-slide-up">
      {/* gradient background with blur at top right and bottom left */}
      <div className="absolute -z-10 w-[32rem] h-[32rem] top-0 right-0 bg-gradient-to-br from-purple-600/15 to-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute -z-10 w-[32rem] h-[32rem] bottom-0 left-0 bg-gradient-to-br from-indigo-600/15 to-purple-600/5 blur-[120px] pointer-events-none" />

      <section className="space-y-6">
        <DashboardHeader subtitle="Welcome back" title={`${greeting}, hope you're doing fine!`} />

        <AiInput
          onProcess={fetchTransactions}
          onManualEntry={() => setIsModalOpen(true)}
        />
      </section>

      <ManualEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchTransactions();
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0f172a]/60 border border-slate-800/80 shadow-xl backdrop-blur-sm flex flex-col min-h-[300px]">
          <div className="flex-1 w-full relative min-h-0">
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
        </div>
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <WalletCard
            title="Total Account Balance"
            balance={totalBalance}
            theme="glass"
            trend={{ value: 2.4, isUpward: true, label: "this week" }}
          />

          <div className="grid grid-cols-2 gap-6 flex-1">
            <WalletCard
              title="Monthly Expenses"
              balance={monthlyExpenses}
              theme="rose"
              trend={{ value: 4.8, isUpward: true, label: "v/s last mo" }}
            />
            <WalletCard
              title="Savings"
              balance={savingsBalance}
              theme="emerald"
              trend={{ value: 12.5, isUpward: true, label: "yield" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm rounded-3xl p-6 h-full flex flex-col">
            {/* Header with Tab Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="space-y-1">
                <h3 className="text-slate-400 font-semibold tracking-wide text-sm uppercase">Recent Activity</h3>
                <p className="text-[11px] text-slate-500">Filters transactions by types</p>
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
        </div>
        <div className="lg:col-span-4">
          <div className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm rounded-3xl p-6 h-full flex flex-col">
            <h3 className="text-slate-400 font-semibold tracking-wide text-sm uppercase mb-6">Category-wise Spend</h3>
            <CategorySpend />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage;
