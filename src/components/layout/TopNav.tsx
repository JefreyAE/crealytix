"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  isLoggedIn: boolean;
  onLogout?: () => Promise<void> | void;
};

export default function TopNav({
  isLoggedIn,
  onLogout,
}: Props) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
          ? "py-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-900/5"
          : "py-6 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-10">

        {/* LOGO SECTION */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-lg scale-0 group-hover:scale-150 transition-transform duration-500" />
            <Image
              src="/Brand logo.png"
              alt="Crealytix Logo"
              width={32}
              height={32}
              className="relative rounded-xl shadow-2xl transition-all duration-500 group-hover:rotate-[10deg]"
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            Crealytix
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  if (onLogout) await onLogout();
                }}
                className="px-6 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-[0.15em] shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* MOBILE MENU TRIGGER */}
        <button className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
    </header>
  );
}
