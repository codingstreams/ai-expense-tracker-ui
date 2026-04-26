'use client'

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { accessToken, loading } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (!loading && accessToken == "") {
      router.push("/login")
    }
  }, [accessToken, router, loading])

  if (loading) {
    return <>Loading...</>
  }

  return accessToken ? <>{children}</> : null
}

export default ProtectedRoute