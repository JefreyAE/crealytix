"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";

type Props = {
  email: string;
  fullName?: string;
  avatarUrl?: string;
  plan: string;
  accountCount: number;
  accountLimit: number;
};

export default function DashboardSidebar({
  email,
  fullName,
  avatarUrl,
  plan,
  accountCount,
  accountLimit,
}: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const displayName = fullName || email;
  const initial = displayName?.charAt(0).toUpperCase() || "?";

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Connect", href: "/dashboard/connect" },
    { name: "Pricing", href: "/pricing" },
  ];

  const usagePercent =
    accountLimit !== Infinity
      ? Math.min((accountCount / accountLimit) * 100, 100)
      : 0;

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-72"} 
        transition-all duration-500 ease-in-out
        relative z-30 flex flex-col
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl
        border-r border-slate-200/60 dark:border-slate-800/60
      `}
    >
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* BRAND LOGO */}
        <div className={`mb-12 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-xl dark:opacity-50" />
            <Image
              src="/Brand logo.png"
              alt="Crealytix Logo"
              width={collapsed ? 36 : 40}
              height={collapsed ? 36 : 40}
              className="relative rounded-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          {!collapsed && (
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Crealytix</span>
          )}
        </div>

        {/* USER PROFILE */}
        <div className={`mb-10 animate-reveal`}>
          <div className={`flex items-center gap-4 p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30 ${collapsed ? "justify-center" : ""}`}>
            <div className="relative shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-xl object-cover ring-2 ring-indigo-500/20"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-600/20">
                  {initial}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <div className="flex items-center gap-1.5 capitalize text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                  <span className="w-1 h-1 rounded-full bg-current" />
                  {plan} user
                </div>
              </div>
            )}
          </div>

          {!collapsed && accountLimit !== Infinity && (
            <div className="mt-6 px-1">
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Quota</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{accountCount} / {accountLimit}</p>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-1.5">
          <p className={`text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4 px-3 ${collapsed ? "text-center" : ""}`}>Menu</p>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 group
                  ${isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? "bg-white scale-100" : "bg-transparent scale-0 group-hover:bg-indigo-400 group-hover:scale-100"}`} />
                {!collapsed && item.name}
                {collapsed && (
                  <div className="w-full flex justify-center">
                    <span className="text-lg">{item.name[0]}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-4">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {collapsed ? "→" : "← Collapse Sidebar"}
        </button>
        <LogoutButton />
      </div>
    </aside>
  );
}
