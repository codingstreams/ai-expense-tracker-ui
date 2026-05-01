'use client'

import AiInput from "@/components/dashboard/AiInput";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import WeeklyGraphTrend from "@/components/dashboard/WeeklyGraphTrend";

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl h-[300px]">
          <WeeklyGraphTrend data={[
            { day: 'Mon', spent: 1200 },
            { day: 'Tue', spent: 900 },
            { day: 'Wed', spent: 2200 },
            { day: 'Thu', spent: 400 },
            { day: 'Fri', spent: 1800 },
            { day: 'Sat', spent: 3500 },
            { day: 'Sun', spent: 2100 },
          ]} />
        </div>
        <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl">

        </div>
      </div>

    </div>
  )
}

export default DashboardPage;

