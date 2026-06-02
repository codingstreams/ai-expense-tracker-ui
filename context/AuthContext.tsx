'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface AuthContextType {
  accessToken: string;
  onboarded: boolean;
  expirationTime: number;
  login: (accessToken: string, onboarded: boolean) => void;
  logout: () => void;
  setOnboarded: (onboarded: boolean) => void;
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [onboarded, setOnboardedState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken")
    const storedOnboarded = localStorage.getItem("onboarded")

    if (storedToken) {
      setAccessToken(storedToken)
    }
    if (storedOnboarded) {
      setOnboardedState(storedOnboarded === "true")
    }

    setLoading(false)
  }, []);

  const login = (token: string, onboardedStatus: boolean) => {
    setAccessToken(token);
    setOnboardedState(onboardedStatus);
    localStorage.setItem("accessToken", token)
    localStorage.setItem("onboarded", String(onboardedStatus))
  };

  const logout = () => {
    console.log("AuthContext: logging out, clearing state, and redirecting...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("onboarded");
    setAccessToken("");
    setOnboardedState(false);
    window.location.href = "/login";
  };

  const setOnboarded = (onboardedStatus: boolean) => {
    setOnboardedState(onboardedStatus);
    localStorage.setItem("onboarded", String(onboardedStatus));
  };

  return (
    <AuthContext.Provider value={{
      accessToken: accessToken,
      onboarded: onboarded,
      expirationTime: 0,
      login: login,
      logout: logout,
      setOnboarded: setOnboarded,
      loading: loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}



export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context
}