'use client'

import AiInput from "@/components/dashboard/AiInput";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const DashboardPage = () => {

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 pb-20">
      {/* gradient background with blur at top right and bottom left */}
      <div className="absolute -z-10 w-[32rem] h-[32rem] top-0 right-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-[100px] z-0" />
      <div className="absolute -z-10 w-[32rem] h-[32rem] bottom-0 left-0 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 blur-[100px] z-0" />


      <section className="space-y-6">
        <DashboardHeader subtitle="Welcome back" title="Good Evening, hope you're doing fine!" />

        <AiInput
          onProcess={() => { }}
        />
      </section>

    </div>
  )
}

export default DashboardPage;

