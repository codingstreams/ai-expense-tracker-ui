'use client'

import { createContext, ReactNode, useContext, useState } from "react"

interface AuthContextType {
  accessToken: string;
  expirationTime: number;
  login: (accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>("");

  const login = (accessToken: string) => {
    setAccessToken(accessToken);
  };


  const logout = () => {
    setAccessToken("");
  };

  return (
    <AuthContext.Provider value={{
      accessToken: accessToken, expirationTime: 0, login: login,
      logout: logout
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