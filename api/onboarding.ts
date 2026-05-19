import { apiFetch } from "./api-client";

export interface BankDto {
  id: number;
  name: string;
}

export interface PaymentModeDto {
  id: number;
  name: string;
  type: string;
}

export interface OnboardingRequestDto {
  bankId: number | null;
  lastFourDigits: string | null;
  bankBalance: number | null;
  cardType: "CREDIT" | "DEBIT" | null;
  cardLastFourDigits: string | null;
  cardLimit: number | null;
  cashBalance: number | null;
  defaultPaymentModeId: number;
  languagePreference: "ENGLISH" | "HINDI" | "SPANISH" | "FRENCH";
}

export async function submitOnboarding(data: OnboardingRequestDto): Promise<{ success: boolean; message?: string }> {
  return await apiFetch("/api/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getBanks(): Promise<BankDto[]> {
  try {
    return await apiFetch("/api/banks", { method: "GET" });
  } catch (error) {
    console.warn("Failed to fetch banks from backend, using graceful fallback list.", error);
    // Return a fallback list of popular banks in case of backend 500 error
    return [
      { id: 1, name: "State Bank of India" },
      { id: 2, name: "HDFC Bank" },
      { id: 3, name: "ICICI Bank" },
      { id: 4, name: "Axis Bank" },
      { id: 5, name: "Kotak Mahindra Bank" },
      { id: 6, name: "Punjab National Bank" }
    ];
  }
}

export async function getPaymentModes(): Promise<PaymentModeDto[]> {
  try {
    return await apiFetch("/api/payment-modes", { method: "GET" });
  } catch (error) {
    console.warn("Failed to fetch payment modes from backend, using verified fallback list.", error);
    return [
      { id: 1, name: "Credit Card", type: "LIABILITY" },
      { id: 2, name: "Debit Card", type: "ASSET" },
      { id: 3, name: "Net Banking", type: "ASSET" },
      { id: 4, name: "UPI", type: "ASSET" },
      { id: 5, name: "Cash", type: "ASSET" },
      { id: 6, name: "Digital Wallet", type: "ASSET" }
    ];
  }
}
