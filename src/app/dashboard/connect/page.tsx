"use client";

import { useState } from "react";
import Image from "next/image";
import PlatformIcon from "@/components/PlatformIcon";

export default function ConnectPage() {
  const [channelUrl, setChannelUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleConnectYouTube = async () => {
    if (!channelUrl) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/youtube/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || "Something went wrong", type: "error" });
      } else {
        setMessage({ text: "YouTube channel connected successfully ✅", type: "success" });
        setChannelUrl("");
      }
    } catch (error) {
      setMessage({ text: "Network error", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12 animate-fadeUp">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
          Expand Your <span className="text-indigo-600">Influence</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
          Connect your social platforms to unlock deep analytics, cross-platform growth tracking, and expert-level channel insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* YOUTUBE CONNECT CARD */}
        <div className="glass p-8 rounded-[2.5rem] border-2 border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center text-center space-y-6 group hover:border-red-500/30 transition-all duration-500">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <PlatformIcon platform="youtube" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">YouTube Analytics</h2>
            <p className="text-sm text-slate-500 font-medium italic">Track subscribers and total views.</p>
          </div>

          <div className="w-full space-y-4 pt-4">
            <input
              type="text"
              placeholder="https://youtube.com/@channel"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              className="w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-4 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/50 transition-all dark:text-white"
            />
            <button
              onClick={handleConnectYouTube}
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 text-white px-6 py-4 font-black transition-all duration-300 hover:shadow-xl hover:shadow-red-600/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Connect YouTube Account"}
            </button>
          </div>
        </div>

        {/* TIKTOK CONNECT CARD */}
        <div className="glass p-8 rounded-[2.5rem] border-2 border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center text-center space-y-6 group hover:border-cyan-400/30 transition-all duration-500">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <PlatformIcon platform="tiktok" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">TikTok Experts</h2>
            <p className="text-sm text-slate-500 font-medium italic">Deep dive into likes and viral trends.</p>
          </div>

          <div className="w-full pt-4 flex-1 flex flex-col justify-end">
            <a
              href="/api/tiktok/auth"
              className="w-full rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 font-black text-center transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20 active:scale-95 flex items-center justify-center gap-3"
            >
              <PlatformIcon platform="tiktok" />
              Sign in with TikTok
            </a>
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-black">Official API Integration</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-reveal ${message.type === "success" ? "bg-green-100 text-green-600 border border-green-200" : "bg-red-100 text-red-600 border border-red-200"
          }`}>
          {message.text}
        </div>
      )}

      {/* FOOTER TIP */}
      <div className="p-8 bg-indigo-600/5 rounded-[2rem] border border-indigo-600/10 flex items-center gap-6">
        <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 font-black">?</div>
        <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80 font-medium">
          <strong>Pro Tip:</strong> Re-connecting an expired account will not lose any historical data. We keep your growth pulse alive even if your token expires.
        </p>
      </div>
    </div>
  );
}

