'use client'

import AiInput from "@/components/dashboard/AiInput";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import WalletCard from "@/components/dashboard/WalletCard";
import WeeklyGraphTrend from "@/components/dashboard/WeeklyGraphTrend";
import { useEffect, useState } from "react";
import { Transaction } from "@/api/model/Transaction";
import { getTransations } from "@/api/transactions";
import { CategorySpend } from "@/components/dashboard/CategorySpend";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { ManualEntryModal } from "@/components/dashboard/ManualEntryModal";
import { Account } from "@/api/model/Account";
import { getAccounts } from "@/api/accounts";
import { getCategoryDistribution, getDailyCashFlow } from "@/api/analytics";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [weeklyData, setWeeklyData] = useState<{ day: string; spent: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  const fetchTransactions = async () => {
    try {
      const txns = await getTransations();
      setTransactions(txns);

      const userAccounts = await getAccounts();
      setAccounts(userAccounts);

      // Fetch actual monthly expenses of the current month
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstDayStr = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-01`;
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const distribution = await getCategoryDistribution(firstDayStr, todayStr);
      const totalSpentThisMonth = distribution.reduce((sum, item) => sum + item.amount, 0);
      setMonthlyExpenses(totalSpentThisMonth);

      // Fetch actual weekly graph trend for past 7 days
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgoStr = `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`;
      
      const weeklyCashFlow = await getDailyCashFlow(sevenDaysAgoStr, todayStr);
      const formattedWeekly = weeklyCashFlow.map(item => {
        const date = new Date(item.transactionDate);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        return {
          day: dayName,
          spent: Math.abs(item.expense)
        };
      });
      setWeeklyData(formattedWeekly);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
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

  // Dynamic calculations based on actual backend data
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.amount, 0);
  const savingsBalance = accounts.filter(acc => acc.type === 'Savings').reduce((sum, acc) => sum + acc.amount, 0);

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
            {loading ? (
              <div className="w-full h-full bg-slate-800/10 animate-pulse rounded-3xl" />
            ) : (
              <WeeklyGraphTrend data={weeklyData} />
            )}
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
          <RecentActivity transactions={transactions} loading={loading} />
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
