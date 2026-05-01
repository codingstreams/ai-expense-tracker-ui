'use client'

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter()
  const { logout } = useAuth()

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20">
      <section className="space-y-6">
        <DashboardHeader subtitle="Welcome back" title="Good Evening, hope you're doing fine!" />
      </section>

    </div>
  )
}

export default DashboardPage;

