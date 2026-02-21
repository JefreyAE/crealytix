"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReconnectTikTokButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReconnect = async () => {
        setLoading(true);
        // Redirect to the same OAuth endpoint used for initial connection
        // appropriately handling the state to indicate a reconnection/refresh if needed
        // For now, simpler is just to link to the auth route
        router.push("/api/tiktok/auth");
    };

    return (
        <button
            onClick={handleReconnect}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
        >
            {loading ? "Connecting..." : "Reconnect TikTok Account"}
        </button>
    );
}
