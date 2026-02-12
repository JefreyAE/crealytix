"use client";

import { useState } from "react";

export default function ConnectPage() {
  const [channelUrl, setChannelUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleConnectYouTube = async () => {
    if (!channelUrl) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/youtube/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage("YouTube channel connected successfully ✅");
        setChannelUrl("");
      }
    } catch (error) {
      setMessage("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto py-20 text-center space-y-6">
      <h1 className="text-2xl font-bold">
        Connect Your Account
      </h1>

      <p className="text-gray-500 dark:text-gray-400">
        Connect your YouTube channel to start tracking real metrics.
      </p>

      {/* Input */}
      <input
        type="text"
        placeholder="Paste YouTube channel URL"
        value={channelUrl}
        onChange={(e) => setChannelUrl(e.target.value)}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {/* Button */}
      <button
        onClick={handleConnectYouTube}
        disabled={loading}
        className="w-full rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600 transition disabled:opacity-50"
      >
        {loading ? "Connecting..." : "Connect YouTube"}
      </button>

      {message && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </div>
      )}
    </div>
  );
}

