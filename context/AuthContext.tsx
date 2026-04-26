'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface AuthContextType {
  accessToken: string;
  expirationTime: number;
  login: (accessToken: string) => void;
  logout: () => void;
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken")

    if (storedToken) {
      setAccessToken(storedToken)
    }

    setLoading(false)
  });

  const login = (accessToken: string) => {
    setAccessToken(accessToken);
    localStorage.setItem("accessToken", accessToken)
  };


  const logout = () => {
    setAccessToken("");
    localStorage.removeItem("accessToken")
  };

  return (
    <AuthContext.Provider value={{
      accessToken: accessToken, expirationTime: 0, login: login,
      logout: logout,
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