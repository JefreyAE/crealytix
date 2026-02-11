"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">

      {/* Glow */}
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

      {/* Back to landing */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
        >
          ← Back to home
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 shadow-xl">

        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:text-indigo-600 transition"
          >
            Crealytix
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Create account
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Start tracking your social analytics
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-100 text-red-600 text-sm px-4 py-2 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2.5 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </main>
  )
}
