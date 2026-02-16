"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "../ui/ConfirmModal";

type Props = {
  channelId: string; // UUID interno
  channelTitle: string;
};

export default function DeleteChannelButton({ channelId, channelTitle }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ pendingDelete, setPendingDelete ] = useState(false)

  const handleDelete = async () => {
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
    <>
      <button
        onClick={()=> setPendingDelete(true)}
        disabled={loading}
        className="ml-3 px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-sm disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete Channel"}
      </button>
      <ConfirmModal
        open={!!pendingDelete}
        title="Confirm Downgrade"
        description={`Are you sure you want to delete ${channelTitle?.toUpperCase()}?`}
        variant="danger"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onCancel={() => setPendingDelete(false)}
        onConfirm={() =>{  
          if (pendingDelete) {
            handleDelete()
            setLoading(true)
          }
        }}
      />
    </>
  );
}
