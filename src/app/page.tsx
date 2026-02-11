"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [instaCount, setInstaCount] = useState(0);
  const [ytCount, setYtCount] = useState(0);

  // Parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    let i = 0;
    let y = 0;

    const instaTarget = 12480;
    const ytTarget = 8210;

    const interval = setInterval(() => {
      i += 250;
      y += 160;

      if (i >= instaTarget) i = instaTarget;
      if (y >= ytTarget) y = ytTarget;

      setInstaCount(i);
      setYtCount(y);

      if (i === instaTarget && y === ytTarget) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-zinc-900 dark:to-black overflow-x-hidden">

      {/* HEADER */}
      <header className="w-full border-b bg-white/70 backdrop-blur-md dark:bg-zinc-900/70 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <h1 className="text-lg font-bold tracking-tight">
            Crealytix
          </h1>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/pricing" className="hover:text-indigo-600 transition">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-indigo-600 transition">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center relative">

        <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Analytics for Modern
          <span className="text-indigo-600"> Creators</span>
        </h2>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Track Instagram and YouTube performance in one clean dashboard.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-medium transition-all hover:scale-105 hover:bg-indigo-700"
          >
            Start Free
          </Link>

          <Link
            href="/pricing"
            className="rounded-xl border border-gray-300 dark:border-gray-700 px-6 py-3 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            View Pricing
          </Link>
        </div>

        {/* Glow */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full" />
        </div>

        {/* MOCK DASHBOARD */}
        <div
          className="mt-20 flex justify-center transition-transform duration-200"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border overflow-hidden">

            <div className="h-10 bg-gray-100 dark:bg-zinc-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            <div className="flex">
              <div className="w-40 bg-gray-50 dark:bg-zinc-800 p-4 space-y-3 text-xs text-gray-500">
                <div className="font-semibold text-gray-800 dark:text-white">
                  Crealytix
                </div>
                <div>Dashboard</div>
                <div>Connect</div>
                <div>Pricing</div>
              </div>

              <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-indigo-50 dark:bg-zinc-700 p-4">
                    <p className="text-xs text-gray-500">
                      Instagram Followers
                    </p>
                    <p className="text-xl font-bold text-indigo-600">
                      {instaCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500">
                      +320 this week
                    </p>
                  </div>

                  <div className="rounded-lg bg-purple-50 dark:bg-zinc-700 p-4">
                    <p className="text-xs text-gray-500">
                      YouTube Subscribers
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      {ytCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500">
                      +210 this week
                    </p>
                  </div>
                </div>

                <div className="h-24 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-zinc-700 dark:to-zinc-600" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-sm border">
            <h3 className="text-xl font-semibold mb-3">
              Unified Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all accounts in one place.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-sm border">
            <h3 className="text-xl font-semibold mb-3">
              Smart Growth Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor weekly performance trends.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-sm border">
            <h3 className="text-xl font-semibold mb-3">
              Scalable Plans
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start free. Upgrade as you grow.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t dark:border-zinc-800 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Crealytix. Built for creators.
      </footer>

    </main>
  );
}
