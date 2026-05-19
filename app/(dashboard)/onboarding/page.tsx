"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  CreditCard,
  Coins,
  Wallet,
  Landmark,
  Check,
  Loader2,
  Building2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Stepper } from '@/components/onboarding/Stepper';
import { useAuth } from '@/context/AuthContext';
import {
  getBanks,
  getPaymentModes,
  submitOnboarding,
  BankDto,
  PaymentModeDto,
  OnboardingRequestDto
} from '@/api/onboarding';

const languages = [
  { code: 'ENGLISH', name: 'English', localName: 'US / UK', icon: '🇬🇧' },
  { code: 'HINDI', name: 'Hindi', localName: 'हिन्दी', icon: '🇮🇳' },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { setOnboarded } = useAuth();

  // Navigation step state
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic lists from backend API
  const [backendBanks, setBackendBanks] = useState<BankDto[]>([]);
  const [backendModes, setBackendModes] = useState<PaymentModeDto[]>([]);
  const [loadingApis, setLoadingApis] = useState(true);

  // Step 1 States: Language & Default Mode
  const [language, setLanguage] = useState<"ENGLISH" | "HINDI" | "SPANISH" | "FRENCH">("ENGLISH");
  const [defaultPaymentModeId, setDefaultPaymentModeId] = useState<number | null>(null);

  // Step 2 States: Linked Accounts (Toggles & Details)
  const [linkBank, setLinkBank] = useState(false);
  const [bankId, setBankId] = useState<number | null>(null);
  const [bankLastFour, setBankLastFour] = useState("");
  const [bankBalance, setBankBalance] = useState("");

  const [linkCard, setLinkCard] = useState(false);
  const [cardType, setCardType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [cardLastFour, setCardLastFour] = useState("");
  const [cardLimit, setCardLimit] = useState("");

  const [cashBalance, setCashBalance] = useState("");

  // Load Banks & Payment Modes on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [banksList, modesList] = await Promise.all([
          getBanks(),
          getPaymentModes()
        ]);
        setBackendBanks(banksList);
        setBackendModes(modesList);

        // Pre-select default payment mode if available
        if (modesList.length > 0) {
          setDefaultPaymentModeId(modesList[0].id);
        }
        // Pre-select default bank if available
        if (banksList.length > 0) {
          setBankId(banksList[0].id);
        }
      } catch (err) {
        console.error("Error loading onboarding master data", err);
      } finally {
        setLoadingApis(false);
      }
    }
    loadData();
  }, []);

  // Helper to map payment mode icons
  const getModeIcon = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('credit')) return <CreditCard className="w-5 h-5" />;
    if (lowercase.includes('debit') || lowercase.includes('card')) return <CreditCard className="w-5 h-5" />;
    if (lowercase.includes('upi')) return <Coins className="w-5 h-5" />;
    if (lowercase.includes('cash')) return <Wallet className="w-5 h-5" />;
    if (lowercase.includes('net') || lowercase.includes('bank')) return <Landmark className="w-5 h-5" />;
    return <Coins className="w-5 h-5" />;
  };

  const handleNextStep = () => {
    if (step === 1 && !defaultPaymentModeId) {
      setErrorMessage("Please select a default payment mode to continue.");
      return;
    }

    // Step 2 validations
    if (step === 2) {
      if (linkBank) {
        if (!bankId) {
          setErrorMessage("Please select your bank.");
          return;
        }
        if (bankLastFour.length !== 4 || isNaN(Number(bankLastFour))) {
          setErrorMessage("Bank account last 4 digits must be exactly 4 numbers.");
          return;
        }
        if (bankBalance === "" || isNaN(Number(bankBalance)) || Number(bankBalance) < 0) {
          setErrorMessage("Please enter a valid non-negative bank balance.");
          return;
        }
      }

      if (linkCard) {
        if (cardLastFour.length !== 4 || isNaN(Number(cardLastFour))) {
          setErrorMessage("Card last 4 digits must be exactly 4 numbers.");
          return;
        }
        if (cardLimit === "" || isNaN(Number(cardLimit)) || Number(cardLimit) < 0) {
          setErrorMessage("Please enter a valid non-negative card limit.");
          return;
        }
      }

      if (cashBalance !== "" && (isNaN(Number(cashBalance)) || Number(cashBalance) < 0)) {
        setErrorMessage("Please enter a valid non-negative cash balance.");
        return;
      }
    }

    setErrorMessage(null);
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    const onboardingDto: OnboardingRequestDto = {
      bankId: linkBank ? Number(bankId) : null,
      lastFourDigits: linkBank ? bankLastFour : null,
      bankBalance: linkBank ? parseFloat(bankBalance) : null,
      cardType: linkCard ? cardType : null,
      cardLastFourDigits: linkCard ? cardLastFour : null,
      cardLimit: linkCard ? parseFloat(cardLimit) : null,
      cashBalance: cashBalance !== "" ? parseFloat(cashBalance) : 0,
      defaultPaymentModeId: defaultPaymentModeId!,
      languagePreference: language
    };

    try {
      await submitOnboarding(onboardingDto);
      // Update local storage and context
      setOnboarded(true);
      setStep(3);
    } catch (err: any) {
      console.error("Onboarding submission failed", err);
      setErrorMessage(err.message || "Failed to save onboarding details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingApis) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-purple-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <span className="font-semibold tracking-wide">Loading configuration...</span>
      </div>
    );
  }

  const selectedPaymentModeName = backendModes.find(m => m.id === defaultPaymentModeId)?.name || 'None';

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center py-12 px-6 relative overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-purple-600/10 to-pink-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-indigo-600/10 to-blue-600/5 blur-[120px] rounded-full -z-10" />

      {/* Title Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Fast AI Setup
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Expense Tracker</span>
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          Let's quickly configure your workspace so our AI model can seamlessly parse and organize your receipts.
        </p>
      </div>

      <Stepper step={step} totalSteps={3} />

      {/* Main Container */}
      <div className="w-full max-w-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-950/10 relative transition-all duration-300">

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* STEP 1: PREFERENCES */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Language Preference Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" /> Choose Language Preference
                </h3>
                <p className="text-xs text-slate-500 mt-1">Select the default language for your dashboard and notifications.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all relative ${language === lang.code
                        ? 'border-purple-600 bg-purple-600/10 text-white shadow-lg shadow-purple-500/10'
                        : 'border-slate-800/60 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                  >
                    {language === lang.code && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <span className="text-3xl filter drop-shadow">{lang.icon}</span>
                    <span className="font-bold text-sm tracking-wide mt-1">{lang.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{lang.localName}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-800/60 my-6" />

            {/* Default Payment Mode Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-pink-400" /> Select Default Payment Mode
                </h3>
                <p className="text-xs text-slate-500 mt-1">Choose the primary source when adding general transactions.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {backendModes.map((mode) => {
                  const isSelected = defaultPaymentModeId === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setDefaultPaymentModeId(mode.id)}
                      className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all text-left relative ${isSelected
                          ? 'border-pink-600 bg-pink-600/10 text-pink-400 shadow-lg shadow-pink-500/10'
                          : 'border-slate-800/60 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-colors ${isSelected ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-500'
                        }`}>
                        {getModeIcon(mode.name)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{mode.name}</div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{mode.type}</div>
                      </div>
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-pink-600 rounded-full flex items-center justify-center text-[8px] text-white">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LINKED ACCOUNTS */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Cash Input (Always visible, simple field) */}
            <div className="p-5 rounded-2xl bg-slate-950/20 border border-slate-800/60 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">Physical Cash Balance</h3>
                  <p className="text-xs text-slate-500">Initial physical cash balance you have in hand.</p>
                </div>
              </div>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">₹</span>
                <input
                  type="text"
                  placeholder="0.00"
                  value={cashBalance}
                  onChange={(e) => setCashBalance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl py-3 pl-8 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Bank Card / Form Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">Link a Bank Account</h3>
                    <p className="text-xs text-slate-500">Add your savings or salary account for tracking.</p>
                  </div>
                </div>
                <button
                  onClick={() => setLinkBank(!linkBank)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${linkBank
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                  {linkBank ? 'Remove' : 'Link Account'}
                </button>
              </div>

              {linkBank && (
                <div className="p-6 bg-slate-950/30 border border-slate-800 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Select Bank</label>
                      <div className="relative">
                        <select
                          value={bankId || ""}
                          onChange={(e) => setBankId(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition-all appearance-none font-medium cursor-pointer"
                        >
                          {backendBanks.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Last 4 Digits</label>
                      <input
                        placeholder="e.g. 9876"
                        maxLength={4}
                        value={bankLastFour}
                        onChange={(e) => setBankLastFour(e.target.value)}
                        className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Current Balance</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">₹</span>
                        <input
                          placeholder="Balance"
                          value={bankBalance}
                          onChange={(e) => setBankBalance(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-8 pr-4 text-sm text-white outline-none focus:border-purple-500 transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-850 my-6" />

            {/* Card Card / Form Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 text-pink-400 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">Link a Card</h3>
                    <p className="text-xs text-slate-500">Link your primary Credit Card or Debit Card.</p>
                  </div>
                </div>
                <button
                  onClick={() => setLinkCard(!linkCard)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${linkCard
                      ? 'bg-pink-600 border-pink-600 text-white'
                      : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                  {linkCard ? 'Remove' : 'Link Card'}
                </button>
              </div>

              {linkCard && (
                <div className="p-6 bg-slate-950/30 border border-slate-800 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-start bg-slate-950 p-1 rounded-xl border border-slate-850 max-w-[200px]">
                    <button
                      onClick={() => setCardType('CREDIT')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${cardType === 'CREDIT' ? 'bg-pink-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                      Credit Card
                    </button>
                    <button
                      onClick={() => setCardType('DEBIT')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${cardType === 'DEBIT' ? 'bg-purple-650 bg-pink-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                      Debit Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Card Last 4 Digits</label>
                      <input
                        placeholder="e.g. 4321"
                        maxLength={4}
                        value={cardLastFour}
                        onChange={(e) => setCardLastFour(e.target.value)}
                        className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                        {cardType === 'CREDIT' ? 'Credit Limit' : 'Current Card Balance'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">₹</span>
                        <input
                          placeholder={cardType === 'CREDIT' ? "Limit Amount" : "Balance"}
                          value={cardLimit}
                          onChange={(e) => setCardLimit(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-8 pr-4 text-sm text-white outline-none focus:border-purple-500 transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 3 && (
          <div className="text-center space-y-6 py-8 sm:py-12 animate-in scale-in duration-300">
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={48} className="stroke-[1.5]" />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Setup Completed!</h1>
            <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
              Your configurations have been successfully synchronised with your account. Let's start tracking your expenses with AI capabilities.
            </p>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950/40 border border-slate-850 text-left space-y-2 mt-6 text-xs text-slate-400">
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="font-medium">Language Preference:</span>
                <span className="text-white font-bold">{languages.find(l => l.code === language)?.name} ({language})</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="font-medium">Default Mode:</span>
                <span className="text-white font-bold">{selectedPaymentModeName}</span>
              </div>
              {linkBank && (
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="font-medium">Linked Bank ID:</span>
                  <span className="text-white font-bold">{backendBanks.find(b => b.id === bankId)?.name} (..{bankLastFour})</span>
                </div>
              )}
              {linkCard && (
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="font-medium">Linked Card:</span>
                  <span className="text-white font-bold">{cardType} Card (..{cardLastFour})</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="font-medium">Physical Cash:</span>
                <span className="text-white font-bold">₹{parseFloat(cashBalance) || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between mt-10 pt-6 border-t border-slate-800/60">
          {step > 1 && step < 3 && (
            <button
              onClick={() => {
                setErrorMessage(null);
                setStep(step - 1);
              }}
              className="px-6 py-3 text-sm text-slate-400 hover:text-white font-bold transition-all hover:bg-slate-800/20 rounded-xl"
              disabled={submitting}
            >
              Back
            </button>
          )}

          {step === 3 ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="ml-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 text-sm hover:scale-[1.02]"
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={step === 2 ? handleSubmit : handleNextStep}
              disabled={submitting}
              className={`ml-auto px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg text-sm hover:scale-[1.02] ${submitting
                  ? 'bg-purple-800 border border-purple-700/50 text-purple-300 cursor-not-allowed shadow-none'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : step === 2 ? (
                <>
                  Complete Setup <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Next Step <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}