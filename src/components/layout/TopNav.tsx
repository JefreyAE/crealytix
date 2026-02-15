"use client";

import { useRouter } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
  onLogout?: () => Promise<void> | void;
};

export default function TopNav({
  isLoggedIn,
  onLogout,
}: Props) {
  const router = useRouter();

  return (
    <div className="w-full border-b bg-white/70 backdrop-blur-md dark:bg-zinc-900/70 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">

        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="text-lg font-bold tracking-tight"
        >
          Crealytix
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          {isLoggedIn && (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm font-medium hover:text-indigo-600 transition"
            >
              Dashboard
            </button>
          )}

          {isLoggedIn ? (
            <button
              onClick={async () => {
                if (onLogout) await onLogout();
              }}
              className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/")}
                className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
              >
                Home
              </button>

              <button
                onClick={() => router.push("/login")}
                className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
              >
                Login
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
