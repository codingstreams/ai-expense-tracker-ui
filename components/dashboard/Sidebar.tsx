"use client"

import Link from "next/link";
import Logo from "../Logo";
import { LayoutDashboard, LineChart, LogOutIcon, User2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Statistics', href: '/statistics', icon: LineChart },
  { name: 'Profile', href: '/profile', icon: User2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-16 lg:w-20 h-screen flex flex-col items-center border-r border-slate-800/60 bg-[#090d16]/60 backdrop-blur-md py-6 sticky top-0 z-30 transition-all duration-300">
      
      {/* Scaled-down Logo container to prevent overflow in compact view */}
      <div className="scale-[0.65] lg:scale-[0.8] origin-center mb-6">
        <Logo />
      </div>

      <nav className="flex-1 w-full px-2">
        <ul className="flex flex-col items-center gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.name}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 border relative group ${
                    isActive
                      ? 'bg-purple-600/10 text-purple-400 border-purple-500/20 shadow-lg shadow-purple-500/5'
                      : 'text-slate-500 border-transparent hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <Icon size={22} className="transition-transform duration-300 group-hover:scale-105" />
                  
                  {/* Glowing active indicator dot on the left */}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-4 bg-purple-500 rounded-r-md" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pb-2">
        <button
          type="button"
          onClick={logout}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 active:scale-95 border border-transparent hover:border-rose-500/15"
          title="Log Out"
        >
          <LogOutIcon size={22} />
        </button>
      </div>

    </aside>
  );
}