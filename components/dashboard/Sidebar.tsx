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
    <aside className="w-20 lg:w-24 h-screen flex flex-col items-center border-r border-purple-500/20 bg-[#0f172a] py-6 sticky top-0 z-30">

      <Logo />
      <nav className="flex-1 w-full px-2">
        <ul className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all border ${isActive
                    ? 'bg-purple-600/20 text-purple-400 border-purple-500/30'
                    : 'text-slate-500 border-transparent hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon size={24} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pb-4">
        <button
          type="button"
          className="p-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
          onClick={logout}
        >
          <LogOutIcon size={24} />
        </button>
      </div>

    </ aside>
  );
}