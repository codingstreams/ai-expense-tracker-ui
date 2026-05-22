"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, Wallet, ArrowRightLeft, PlusCircle } from 'lucide-react';
import { apiFetch } from '../../api/api-client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EntryType = 'expense' | 'income' | 'transfer';

export const ManualEntryModal = ({ isOpen, onClose }: ModalProps) => {
  const [type, setType] = useState<EntryType>('expense');
  
  // Form State
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('1');
  const [toAccountId, setToAccountId] = useState('2');
  const [paymentModeId, setPaymentModeId] = useState('5');
  
  // Data State
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [accounts, setAccounts] = useState<{id: number, name: string}[]>([]);
  const [paymentModes, setPaymentModes] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    if (isOpen) {
      apiFetch('/api/categories')
        .then(data => {
            setCategories(data);
            if (data.length > 0) setCategoryId(data[0].id.toString());
        })
        .catch(err => console.error("Failed to fetch categories:", err));

      apiFetch('/api/accounts')
        .then(data => {
            setAccounts(data);
            if (data.length > 0) {
              setAccountId(data[0].id.toString());
              if (data.length > 1) {
                setToAccountId(data[1].id.toString());
              } else {
                setToAccountId(data[0].id.toString());
              }
            }
        })
        .catch(err => console.error("Failed to fetch accounts:", err));

      apiFetch('/api/payment-modes')
        .then(data => {
            setPaymentModes(data);
            if (data.length > 0) setPaymentModeId(data[0].id.toString());
        })
        .catch(err => console.error("Failed to fetch payment modes:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Format Date from YYYY-MM-DD (HTML input) to DD-MM-YYYY (Backend requirement)
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}-${month}-${year}`;

    // 2. Construct Payload
    let payload: any = {
      type: type.toUpperCase(),
      description,
      amount: parseFloat(amount),
      transactionDate: formattedDate,
      paymentModeId: parseInt(paymentModeId),
      categoryId: parseInt(categoryId)
    };

    if (type === 'transfer') {
      payload.accountId = parseInt(accountId);
      payload.toAccountId = parseInt(toAccountId);
    } else {
      payload.accountId = parseInt(accountId);
    }

    // 3. Make POST Request
    try {
      await apiFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      onClose(); // Close modal on success
    } catch (error) {
      console.error("Failed to submit transaction", error);
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <PlusCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Add Transaction</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Entry Type Tabs */}
        <div className="p-1 mx-6 mt-6 bg-slate-950 rounded-xl flex border border-slate-800">
          {(['expense', 'income', 'transfer'] as EntryType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${type === t ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 ml-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-8 pr-4 text-white outline-none focus:border-purple-500" 
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 ml-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white outline-none focus:border-purple-500 text-sm" 
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 ml-1">Description / Payee</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Amazon, Rent, Salary" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm" 
              required
            />
          </div>

          {type === 'transfer' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 ml-1">From Account</label>
                <select 
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
                  required
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                  {accounts.length === 0 && <option value="">Loading...</option>}
                </select>
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-xs text-slate-500 ml-1">To Account</label>
                <select 
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
                  required
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                  {accounts.length === 0 && <option value="">Loading...</option>}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 ml-1">Category</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && <option value="">Loading...</option>}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 ml-1">Account</label>
                <select 
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
                  required
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                  {accounts.length === 0 && <option value="">Loading...</option>}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 ml-1">Payment Mode</label>
            <select 
              value={paymentModeId}
              onChange={(e) => setPaymentModeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
              required
            >
              {paymentModes.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.name}</option>
              ))}
              {paymentModes.length === 0 && <option value="">Loading...</option>}
            </select>
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl mt-4 transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20">
            Save {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
};