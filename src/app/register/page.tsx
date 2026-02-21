"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import GoogleLoginButton from "@/components/Login/GoogleLoginButton"

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
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 selection:bg-indigo-500/30">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-500/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      {/* TOP NAVIGATION BACK LINK */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Home
        </Link>
      </div>

      {/* REGISTER CARD */}
      <div className="relative z-10 w-full max-w-[440px] animate-fadeUp">
        <div className="glass dark:bg-slate-900/60 p-8 md:p-10 rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 shadow-2xl">
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150" />
                <Image
                  src="/Brand logo.png"
                  alt="Crealytix Logo"
                  width={48}
                  height={48}
                  className="relative rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Crealytix</span>
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
              Create account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Join 2,000+ creators tracking their growth
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400"
                placeholder="至少 8 位字符"
              />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-100 text-red-600 text-sm font-medium animate-reveal dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white py-4 font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <GoogleLoginButton label="Sign up with Google" />

            <p className="mt-6 text-center text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* FOOTER DECORATION */}
      <div className="absolute bottom-8 text-center w-full pointer-events-none">
        <p className="text-slate-400 text-sm font-medium">100% Secure & Compliant Social Analytics</p>
      </div>
    </main>
  )
}
