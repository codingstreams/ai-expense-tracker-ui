'use client'

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter()
  const { logout } = useAuth()

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20">
      Dashboard Page
      <button className="bg-purple-900 text-center mx-4 my-2 px-2 py-2 rounded-md cursor-pointer" onClick={() => {
        logout();
        router.push("/login")
      }}>Logout</button>
    </div>
  )
}

export default DashboardPage;

