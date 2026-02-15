"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  channelId: string; // UUID interno
};

export default function DeleteChannelButton({ channelId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  console.log(channelId)
  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this channel? This cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);

    const res = await fetch(`/api/youtube/${channelId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("Failed to delete channel");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="ml-3 px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-sm disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Channel"}
    </button>
  );
}
