"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [instaCount, setInstaCount] = useState(0);
  const [ytCount, setYtCount] = useState(0);
  const [tkCount, setTkCount] = useState(0);

  // Parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    let i = 0;
    let y = 0;
    let t = 0;

    const instaTarget = 12480;
    const ytTarget = 8210;
    const tkTarget = 15430;

    const interval = setInterval(() => {
      i += 250;
      y += 160;
      t += 310;

      if (i >= instaTarget) i = instaTarget;
      if (y >= ytTarget) y = ytTarget;
      if (t >= tkTarget) t = tkTarget;

      setInstaCount(i);
      setYtCount(y);
      setTkCount(t);

      if (i === instaTarget && y === ytTarget && t === tkTarget) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden relative selection:bg-indigo-500/30">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-500/10 blur-[100px] rounded-full animate-float [animation-delay:2s]" />
        <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-blue-500/5 blur-[80px] rounded-full animate-float [animation-delay:4s]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              C
            </div>
            <span className="text-xl font-bold tracking-tight">Crealytix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-slate-500 hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="/pricing" className="text-slate-500 hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="/login" className="text-slate-500 hover:text-indigo-600 transition-colors">Login</Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md shadow-slate-900/10 dark:shadow-white/5 active:scale-95"
            >
              Get Started
            </Link>
          </nav>

          <div className="md:hidden">
            <button className="p-2 text-slate-500">☰</button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="animate-fadeUp inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: TikTok Integration is Live
          </div>

          <h1 className="animate-fadeUp [animation-delay:200ms] text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Analytics for <br />
            <span className="text-indigo-600"> Modern Creators</span>
          </h1>

          <p className="animate-fadeUp [animation-delay:400ms] text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Unify your social growth across Instagram, YouTube, and TikTok.
            Real-time data at your fingertips in one premium dashboard.
          </p>

          <div className="animate-fadeUp [animation-delay:600ms] flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="group relative px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 shadow-xl shadow-indigo-600/20"
            >
              <div className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              Start Growing Free
            </Link>

            <Link
              href="/pricing"
              className="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all active:scale-95"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* MOCK DASHBOARD WRAPPER */}
        <div className="mt-24 md:mt-32 max-w-6xl mx-auto px-4 perspective-1000">
          <div
            className="relative transition-all duration-700 ease-out"
            style={{
              transform: `rotateX(${Math.max(0, 5 - scrollY / 100)}deg) translateY(${scrollY * 0.05}px)`,
              opacity: Math.min(1, 1),
            }}
          >
            {/* Browser Frame */}
            <div className="w-full rounded-2xl bg-white dark:bg-slate-900 shadow-[0_22px_70px_4px_rgba(0,0,0,0.15)] dark:shadow-[0_22px_70px_4px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="h-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400/80 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400/80 rounded-full" />
                  <div className="w-3 h-3 bg-green-400/80 rounded-full" />
                </div>
                <div className="ml-4 h-6 px-4 flex-1 max-w-sm rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center">
                  <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-full mr-2" />
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row min-h-[400px]">
                {/* Mock Sidebar */}
                <div className="hidden md:block w-56 bg-slate-50 dark:bg-slate-900/50 p-6 space-y-6 border-r border-slate-200 dark:border-slate-800">
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-10 w-full bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50" />
                    <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
                    <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
                    <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
                  </div>
                </div>

                {/* Mock Content */}
                <div className="flex-1 p-8 space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800/50 rounded-md" />
                    </div>
                    <div className="h-10 w-32 bg-indigo-600 rounded-lg" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Instagram Card */}
                    <div className="group rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center text-white mb-4">
                        IG
                      </div>
                      <p className="text-sm text-slate-500 mb-1">Followers</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">
                        {instaCount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold leading-none">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        +2.4%
                      </div>
                    </div>

                    {/* YouTube Card */}
                    <div className="group rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white mb-4">
                        YT
                      </div>
                      <p className="text-sm text-slate-500 mb-1">Subscribers</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">
                        {ytCount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold leading-none">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        +1.8%
                      </div>
                    </div>

                    {/* TikTok Card */}
                    <div className="group rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-black text-white flex items-center justify-center mb-4 border border-slate-700">
                        TK
                      </div>
                      <p className="text-sm text-slate-500 mb-1">Followers</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">
                        {tkCount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold leading-none">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        +4.2%
                      </div>
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="h-48 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/30 flex items-end p-6 gap-3">
                    <div className="flex-1 bg-indigo-500/20 rounded-t-lg h-[40%] group-hover:h-[50%] transition-all"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t-lg h-[70%]"></div>
                    <div className="flex-1 bg-indigo-500/40 rounded-t-lg h-[30%]"></div>
                    <div className="flex-1 bg-indigo-500/50 rounded-t-lg h-[90%]"></div>
                    <div className="flex-1 bg-indigo-600 rounded-t-lg h-[60%] shadow-lg shadow-indigo-500/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Features</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Everything for your growth</h3>
            <p className="text-slate-500 max-w-xl mx-auto">Focus on creating. Let us handle the data and give you actionable insights.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Unified Dashboard</h4>
              <p className="text-slate-500 leading-relaxed">
                Connect your YouTube, Instagram, and TikTok accounts. See your total reach in one singular view without switching tabs.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Smart Growth Insights</h4>
              <p className="text-slate-500 leading-relaxed">
                Our AI analyzes your performance trends and suggests the best times to post based on your audience engagement.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Scalable Plans</h4>
              <p className="text-slate-500 leading-relaxed">
                From solo creators to agency giants. Start for free and upgrade as your influence reaches new heights.
              </p>
            </div>
          </div>
        </div>

        {/* Floating gradient */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] -z-10 rounded-full" />
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 dark:bg-indigo-600 p-12 md:p-20 relative overflow-hidden text-center text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to take your social <br className="hidden md:block" /> game to the next level?</h2>
            <p className="text-indigo-100/70 text-lg mb-12 max-w-xl mx-auto">Join 2,000+ creators building their empire with Crealytix.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/register" className="px-10 py-5 rounded-2xl bg-white text-indigo-600 font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">Create Free Account</Link>
              <Link href="/pricing" className="px-10 py-5 rounded-2xl bg-indigo-500 text-white font-bold text-xl border border-indigo-400/30 hover:bg-indigo-400 transition-all">See Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-bold tracking-tight text-slate-900 dark:text-white">Crealytix</span>
          </div>

          <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Terms</Link>
          </div>

          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} Crealytix. Build with ❤️ for creators.
          </div>
        </div>
      </footer>
    </main>
  );
}
