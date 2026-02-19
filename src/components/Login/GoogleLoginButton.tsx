"use client";

import { supabase } from "@/lib/supabase/client";

export default function GoogleLoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 py-2.5 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
    >
      Continue with Google
    </button>
  );
}
