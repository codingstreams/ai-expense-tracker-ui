"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, PlusCircle } from 'lucide-react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiFetch } from '../../api/api-client';
import { Account } from '../../api/model/Account';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const transactionSchema = z.object({
  type: z.enum(['expense', 'income', 'transfer']),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Amount must be a positive number",
  }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().min(1, { message: "Description/Payee is required" }),
  categoryId: z.string().optional(),
  accountId: z.string().min(1, { message: "Account is required" }),
  toAccountId: z.string().optional(),
  paymentModeId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'transfer') {
    if (!data.toAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "To Account is required",
        path: ["toAccountId"],
      });
    } else if (data.accountId === data.toAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "From and To Accounts cannot be the same",
        path: ["toAccountId"],
      });
    }
  }
  if (data.type === 'expense' && !data.categoryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Category is required",
      path: ["categoryId"],
    });
  }
});

type TransactionFormData = z.infer<typeof transactionSchema>;

// Sub-component for Switching Entry Type
const TypeTabs = () => {
  const { watch, setValue } = useFormContext<TransactionFormData>();
  const type = watch('type');

  return (
    <div className="p-1 mx-6 mt-6 bg-slate-950 rounded-xl flex border border-slate-800">
      {(['expense', 'income', 'transfer'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setValue('type', t)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
            type === t ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

// Sub-component for Amount and Date Fields
const AmountDateFields = () => {
  const { register, formState: { errors } } = useFormContext<TransactionFormData>();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs text-slate-500 ml-1">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
          <input
            type="number"
            step="any"
            {...register('amount')}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-8 pr-4 text-white outline-none focus:border-purple-500 text-sm"
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.amount.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-slate-500 ml-1">Date</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="date"
            {...register('date')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white outline-none focus:border-purple-500 text-sm"
          />
        </div>
        {errors.date && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.date.message}</p>
        )}
      </div>
    </div>
  );
};

// Sub-component for Description Field
const DescriptionField = () => {
  const { register, formState: { errors } } = useFormContext<TransactionFormData>();

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-slate-500 ml-1">Description / Payee</label>
      <input
        type="text"
        {...register('description')}
        placeholder="e.g. Amazon, Rent, Salary"
        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm"
      />
      {errors.description && (
        <p className="text-red-500 text-xs mt-1 ml-1">{errors.description.message}</p>
      )}
    </div>
  );
};

interface AccountCategoryFieldsProps {
  categories: { id: number; name: string }[];
  accounts: Account[];
}

// Sub-component for Accounts and Category Grid
const AccountCategoryFields = ({ categories, accounts }: AccountCategoryFieldsProps) => {
  const { register, watch, formState: { errors } } = useFormContext<TransactionFormData>();
  const type = watch('type');
  const accountId = watch('accountId');
  const toAccountId = watch('toAccountId');

  if (type === 'transfer') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-500 ml-1">From Account</label>
          <select
            {...register('accountId')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
          >
            {accounts.filter(acc => acc.id !== toAccountId).map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.bankName} {acc.lastFour !== "0000" && acc.lastFour !== "CASH" ? `(•••• ${acc.lastFour})` : ""}
              </option>
            ))}
            {accounts.length === 0 && <option value="">Loading...</option>}
          </select>
          {errors.accountId && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.accountId.message}</p>
          )}
        </div>
        <div className="space-y-1.5 flex flex-col justify-end">
          <label className="text-xs text-slate-500 ml-1">To Account</label>
          <select
            {...register('toAccountId')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
          >
            {accounts.filter(acc => acc.id !== accountId).map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.bankName} {acc.lastFour !== "0000" && acc.lastFour !== "CASH" ? `(•••• ${acc.lastFour})` : ""}
              </option>
            ))}
            {accounts.length === 0 && <option value="">Loading...</option>}
          </select>
          {errors.toAccountId && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.toAccountId.message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {type !== 'income' && (
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <label className="text-xs text-slate-500 ml-1">Category</label>
          <select
            {...register('categoryId')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
            {categories.length === 0 && <option value="">Loading...</option>}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.categoryId.message}</p>
          )}
        </div>
      )}
      <div className={`space-y-1.5 ${type === 'income' ? 'col-span-2' : ''}`}>
        <label className="text-xs text-slate-500 ml-1">Account</label>
        <select
          {...register('accountId')}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
        >
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.bankName} {acc.lastFour !== "0000" && acc.lastFour !== "CASH" ? `(•••• ${acc.lastFour})` : ""}
            </option>
          ))}
          {accounts.length === 0 && <option value="">Loading...</option>}
        </select>
        {errors.accountId && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.accountId.message}</p>
        )}
      </div>
    </div>
  );
};

interface PaymentModeFieldProps {
  paymentModes: { id: number; name: string }[];
  shouldHide: boolean;
}

// Sub-component for Payment Mode Selector
const PaymentModeField = ({ paymentModes, shouldHide }: PaymentModeFieldProps) => {
  const { register, formState: { errors } } = useFormContext<TransactionFormData>();

  if (shouldHide) return null;

  return (
    <div className="space-y-1.5 animate-in fade-in duration-200">
      <label className="text-xs text-slate-500 ml-1">Payment Mode</label>
      <select
        {...register('paymentModeId')}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white outline-none focus:border-purple-500 text-sm appearance-none"
      >
        {paymentModes.map(pm => (
          <option key={pm.id} value={pm.id}>{pm.name}</option>
        ))}
        {paymentModes.length === 0 && <option value="">Loading...</option>}
      </select>
      {errors.paymentModeId && (
        <p className="text-red-500 text-xs mt-1 ml-1">{errors.paymentModeId.message}</p>
      )}
    </div>
  );
};

// Main Modal Container Component
export const ManualEntryModal = ({ isOpen, onClose }: ModalProps) => {
  // Data State
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [paymentModes, setPaymentModes] = useState<{ id: number; name: string }[]>([]);

  const methods = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      accountId: '',
      toAccountId: '',
      categoryId: '',
      paymentModeId: '',
    }
  });

  const { setValue, watch, handleSubmit } = methods;

  const type = watch('type');
  const accountId = watch('accountId');
  const toAccountId = watch('toAccountId');

  // Load lookup data on mount
  useEffect(() => {
    if (isOpen) {
      apiFetch('/api/categories')
        .then(data => {
          setCategories(data);
          if (data.length > 0) setValue('categoryId', data[0].id.toString());
        })
        .catch(err => console.error("Failed to fetch categories:", err));

      apiFetch('/api/accounts')
        .then(data => {
          setAccounts(data);
          if (data.length > 0) {
            setValue('accountId', data[0].id.toString());
            if (data.length > 1) {
              setValue('toAccountId', data[1].id.toString());
            } else {
              setValue('toAccountId', data[0].id.toString());
            }
          }
        })
        .catch(err => console.error("Failed to fetch accounts:", err));

      apiFetch('/api/payment-modes')
        .then(data => {
          setPaymentModes(data);
          if (data.length > 0) setValue('paymentModeId', data[0].id.toString());
        })
        .catch(err => console.error("Failed to fetch payment modes:", err));
    }
  }, [isOpen, setValue]);

  // Auto-set payment mode to Cash if account is Cash and type is expense
  useEffect(() => {
    if (type === 'expense') {
      const selectedAccount = accounts.find(acc => acc.id === accountId);
      if (selectedAccount?.type === 'Cash') {
        const cashPaymentMode = paymentModes.find(pm => pm.name.toLowerCase() === 'cash');
        if (cashPaymentMode) {
          setValue('paymentModeId', cashPaymentMode.id.toString());
        }
      }
    }
  }, [type, accountId, accounts, paymentModes, setValue]);

  // Prevent From Account and To Account from being the same in Transfer mode
  useEffect(() => {
    if (type === 'transfer' && accountId === toAccountId && accounts.length > 1) {
      const otherAccount = accounts.find(acc => acc.id !== accountId);
      if (otherAccount) {
        setValue('toAccountId', otherAccount.id.toString());
      }
    }
  }, [type, accountId, toAccountId, accounts, setValue]);

  if (!isOpen) return null;

  const selectedAccount = accounts.find(acc => acc.id === accountId);
  const shouldHidePaymentMode = type === 'expense' && selectedAccount?.type === 'Cash';

  const onSubmit = async (data: TransactionFormData) => {
    // 1. Format Date from YYYY-MM-DD to DD-MM-YYYY
    const [year, month, day] = data.date.split('-');
    const formattedDate = `${day}-${month}-${year}`;

    // 2. Construct Payload
    let payload: any = {
      type: data.type.toUpperCase(),
      description: data.description,
      amount: parseFloat(data.amount),
      transactionDate: formattedDate,
      paymentModeId: data.paymentModeId ? parseInt(data.paymentModeId) : null,
      categoryId: data.categoryId ? parseInt(data.categoryId) : null
    };

    if (data.type === 'transfer') {
      payload.accountId = parseInt(data.accountId);
      payload.toAccountId = data.toAccountId ? parseInt(data.toAccountId) : null;
    } else {
      payload.accountId = parseInt(data.accountId);
    }

    try {
      await apiFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      onClose();
    } catch (error) {
      console.error("Failed to submit transaction", error);
    }
  };

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

        <FormProvider {...methods}>
          <TypeTabs />

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            <AmountDateFields />
            <DescriptionField />
            <AccountCategoryFields categories={categories} accounts={accounts} />
            <PaymentModeField paymentModes={paymentModes} shouldHide={shouldHidePaymentMode} />

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl mt-4 transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20">
              Save {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};