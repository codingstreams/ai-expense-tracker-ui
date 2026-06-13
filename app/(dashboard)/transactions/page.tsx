'use client'

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Calendar, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  Tag, 
  Briefcase, 
  CreditCard,
  X
} from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/api/api-client";
import { getPaginatedTransactions, TransactionFilters, PaginatedResponse } from "@/api/transactions";
import { Transaction } from "@/api/model/Transaction";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Account } from "@/api/model/Account";

export default function TransactionsPage() {
  // Option lists
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [paymentModes, setPaymentModes] = useState<{ id: number; name: string }[]>([]);

  // Selected filters
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState<number | "">("");
  const [maxAmount, setMaxAmount] = useState<number | "">("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState<number[]>([]);

  // Pagination & Sorting state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("transactionDate");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  // Page response data
  const [transactionPage, setTransactionPage] = useState<PaginatedResponse<Transaction>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    empty: true
  });
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cats, accs, pms] = await Promise.all([
          apiFetch("/api/categories"),
          apiFetch("/api/accounts"),
          apiFetch("/api/payment-modes")
        ]);
        setCategories(cats);
        setAccounts(accs);
        setPaymentModes(pms);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchOptions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const filters: TransactionFilters = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minAmount: minAmount !== "" ? minAmount : undefined,
        maxAmount: maxAmount !== "" ? maxAmount : undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        accountIds: selectedAccounts.length > 0 ? selectedAccounts.map(id => parseInt(id)) : undefined,
        paymentModeIds: selectedPaymentModes.length > 0 ? selectedPaymentModes : undefined,
        search: searchTerm.trim() || undefined
      };

      const data = await getPaginatedTransactions(page, size, sortBy, sortDirection, filters);
      setTransactionPage(data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on selections/pagination changes
  useEffect(() => {
    fetchTransactions();
  }, [page, size, sortBy, sortDirection, selectedTypes, selectedCategories, selectedAccounts, selectedPaymentModes]);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(0);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedAccounts([]);
    setSelectedPaymentModes([]);
    setPage(0);
  };

  // Selection togglers
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const updated = prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
      setPage(0);
      return updated;
    });
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev => {
      const updated = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id];
      setPage(0);
      return updated;
    });
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => {
      const updated = prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id];
      setPage(0);
      return updated;
    });
  };

  const togglePaymentMode = (id: number) => {
    setSelectedPaymentModes(prev => {
      const updated = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      setPage(0);
      return updated;
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDirection("DESC");
    }
    setPage(0);
  };

  // Helper values for pagination
  const startEntryIndex = transactionPage.empty ? 0 : page * size + 1;
  const endEntryIndex = Math.min((page + 1) * size, transactionPage.totalElements);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20 animate-slide-up">
      {/* gradient background with blur */}
      <div className="absolute -z-10 w-[32rem] h-[32rem] top-0 right-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute -z-10 w-[32rem] h-[32rem] bottom-0 left-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/5 blur-[120px] pointer-events-none" />

      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DashboardHeader subtitle="View history, apply advanced filters and search" title="Transactions History" />
        <Link 
          href="/dashboard"
          className="px-4 py-2 text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-sm flex items-center gap-1.5"
        >
          Back to Dashboard
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FILTERS PANEL */}
        <aside className={`lg:col-span-4 bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm rounded-3xl p-6 space-y-6 ${
          showMobileFilters ? 'block fixed inset-0 z-50 overflow-y-auto bg-slate-950 p-8 lg:relative lg:block lg:inset-auto lg:z-auto' : 'hidden lg:block'
        }`}>
          <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
            </div>
            {showMobileFilters && (
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
            <button 
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-purple-400 hover:text-purple-300 uppercase hover:underline"
            >
              Reset All
            </button>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-5">
            {/* Search filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Search Payee / Description</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Amazon, Rent, etc..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-1.5 pl-8 pr-2 text-[10px] text-white outline-none focus:border-purple-500 transition-colors text-slate-300"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-1.5 pl-8 pr-2 text-[10px] text-white outline-none focus:border-purple-500 transition-colors text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Amount Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">Min</span>
                  <input 
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    placeholder="0"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-1.5 pl-9 pr-2 text-[11px] text-white outline-none focus:border-purple-500 transition-colors text-right"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">Max</span>
                  <input 
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    placeholder="Any"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-1.5 pl-9 pr-2 text-[11px] text-white outline-none focus:border-purple-500 transition-colors text-right"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-purple-400 hover:text-purple-300 font-bold rounded-xl border border-purple-500/10 text-xs transition-all active:scale-[0.98] mt-2 cursor-pointer"
            >
              Apply Text & Range Filters
            </button>
          </form>

          {/* Types selection */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Transaction Types</label>
            <div className="flex flex-wrap gap-1.5">
              {["INCOME", "EXPENSE", "TRANSFER"].map(type => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      isSelected 
                        ? "bg-purple-600/10 border-purple-500/40 text-purple-400" 
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {type.toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accounts selection */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Briefcase size={12} className="text-slate-500" />
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Accounts</label>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {accounts.map(acc => {
                const isSelected = selectedAccounts.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    onClick={() => toggleAccount(acc.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      isSelected 
                        ? "bg-purple-600/10 border-purple-500/40 text-purple-400" 
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {acc.bankName} {acc.lastFour !== "0000" && acc.lastFour !== "CASH" ? `(•••• ${acc.lastFour})` : ""}
                  </button>
                );
              })}
              {accounts.length === 0 && <span className="text-[10px] text-slate-650">No accounts loaded</span>}
            </div>
          </div>

          {/* Categories selection */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Tag size={12} className="text-slate-500" />
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Categories</label>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {categories.map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      isSelected 
                        ? "bg-purple-600/10 border-purple-500/40 text-purple-400" 
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
              {categories.length === 0 && <span className="text-[10px] text-slate-650">No categories loaded</span>}
            </div>
          </div>

          {/* Payment Modes selection */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <CreditCard size={12} className="text-slate-500" />
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Payment Modes</label>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {paymentModes.map(pm => {
                const isSelected = selectedPaymentModes.includes(pm.id);
                return (
                  <button
                    key={pm.id}
                    onClick={() => togglePaymentMode(pm.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      isSelected 
                        ? "bg-purple-600/10 border-purple-500/40 text-purple-400" 
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {pm.name}
                  </button>
                );
              })}
              {paymentModes.length === 0 && <span className="text-[10px] text-slate-650">No payment modes loaded</span>}
            </div>
          </div>
        </aside>

        {/* TRANSACTIONS MAIN PANEL */}
        <main className="lg:col-span-8 flex flex-col gap-4 w-full">
          {/* Controls Header (Mobile filters button, results count, sorting trigger) */}
          <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm px-5 py-4 rounded-2xl w-full">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all"
              >
                <Filter size={12} />
                Filters
              </button>
              <p className="text-xs text-slate-400 font-medium">
                {loading ? "Searching..." : `Showing ${startEntryIndex} - ${endEntryIndex} of ${transactionPage.totalElements} entries`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort By controls */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
                <button
                  onClick={() => handleSort("transactionDate")}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-semibold flex items-center gap-1 ${
                    sortBy === "transactionDate" ? "bg-slate-850 text-purple-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Date
                  <ArrowUpDown size={10} />
                </button>
                <button
                  onClick={() => handleSort("amount")}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-semibold flex items-center gap-1 ${
                    sortBy === "amount" ? "bg-slate-850 text-purple-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Amount
                  <ArrowUpDown size={10} />
                </button>
              </div>

              {/* Page size control */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Size:</span>
                <select
                  value={size}
                  onChange={(e) => {
                    setSize(parseInt(e.target.value));
                    setPage(0);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-1 px-2 text-white outline-none focus:border-purple-500"
                >
                  {[5, 10, 25, 50].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List Area */}
          <div className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm rounded-3xl p-6 min-h-[400px] flex flex-col justify-between w-full">
            <div className="space-y-1.5 flex-1">
              {loading ? (
                // Skeleton Loader
                Array.from({ length: size }).map((_, i) => (
                  <div key={i} className="h-16 w-full bg-slate-800/20 animate-pulse rounded-2xl" />
                ))
              ) : transactionPage.content.length === 0 ? (
                <div className="h-80 flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <SlidersHorizontal size={36} className="text-slate-600" />
                  <p className="text-sm font-semibold">No matching transactions found</p>
                  <p className="text-xs text-slate-600 text-center max-w-xs">
                    Try broadening your filters, typing a different description, or creating new transactions.
                  </p>
                </div>
              ) : (
                transactionPage.content.map((tx) => (
                  <TransactionItem key={tx.transactionId} {...tx} />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {transactionPage.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/60 mt-6 text-xs">
                <button
                  disabled={page === 0 || loading}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-all font-semibold active:scale-95 disabled:pointer-events-none"
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: transactionPage.totalPages }).map((_, i) => {
                    // Display ellipsis for large page lists if necessary
                    const isNearCurrent = Math.abs(i - page) <= 1;
                    const isFirstOrLast = i === 0 || i === transactionPage.totalPages - 1;
                    if (!isNearCurrent && !isFirstOrLast) {
                      if (i === 1 || i === transactionPage.totalPages - 2) {
                        return <span key={i} className="text-slate-600 px-1">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={i}
                        disabled={loading}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-xl font-bold transition-all ${
                          page === i 
                            ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                            : "text-slate-500 hover:text-slate-200 bg-slate-950/60 border border-slate-800/50 hover:border-slate-800"
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page === transactionPage.totalPages - 1 || loading}
                  onClick={() => setPage(p => Math.min(transactionPage.totalPages - 1, p + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-all font-semibold active:scale-95 disabled:pointer-events-none"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
