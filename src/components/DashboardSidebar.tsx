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
      className={`${collapsed ? "w-20" : "w-64"
        } transition-all duration-300 bg-white dark:bg-[#111827] border-r dark:border-gray-800 flex flex-col justify-between`}
    >
      <div className="p-6">
        {/* USER */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                    {initial}
                  </div>
                )}

                <div>
                  <p className="font-medium text-sm truncate max-w-[120px]">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {plan} plan
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
            >
              ☰
            </button>
          </div>

          {/* USAGE */}
          {!collapsed && accountLimit !== Infinity && (
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">
                Accounts Used
              </p>

              <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>

              <p className="text-xs mt-2 text-gray-500">
                {accountCount} / {accountLimit}
              </p>
            </div>
          )}

          {!collapsed && accountLimit === Infinity && (
            <p className="text-xs mt-6 text-gray-500">
              Unlimited accounts
            </p>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
              >
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t dark:border-gray-800">
        <LogoutButton />
      </div>
    </aside>
  );
}
