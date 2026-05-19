'use client'

import { useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { ReactNode, useEffect } from "react"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { accessToken, onboarded, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    if (accessToken === "") {
      router.push("/login")
    } else if (!onboarded && pathname !== "/onboarding") {
      router.push("/onboarding")
    } else if (onboarded && pathname === "/onboarding") {
      router.push("/dashboard")
    }
  }, [accessToken, onboarded, router, loading, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-purple-400 font-medium">
        Loading...
      </div>
    )
  }

  // If unauthorized or in the process of redirecting, render nothing
  if (accessToken === "") return null
  if (!onboarded && pathname !== "/onboarding") return null
  if (onboarded && pathname === "/onboarding") return null

  return <>{children}</>
}

export default ProtectedRoute