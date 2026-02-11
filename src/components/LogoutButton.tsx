"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
    >
      Logout
    </button>
  );
}
