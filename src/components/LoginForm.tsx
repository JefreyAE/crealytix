"use client"

import { supabase } from "@/lib/supabase/client"

export default function LoginForm() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      window.location.href = "/dashboard"
    }
  }

  return (...)
}
