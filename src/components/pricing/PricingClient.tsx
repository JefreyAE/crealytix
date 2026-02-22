"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TopNav from "../layout/TopNav";
import { supabase } from "@/lib/supabase/client";
import ConfirmModal from "../ui/ConfirmModal";
import AlertModal from "../ui/AlertModal";
import { PLANS } from "@/lib/config/plan.config";
import { Plan, isDowngrade } from "@/lib/services/plan.service";

type Props = {
  currentPlan: Plan;
  isLoggedIn: boolean;
};

export default function PricingClient({
  currentPlan,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState<Plan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingDowngrade, setPendingDowngrade] =
    useState<Plan | null>(null);

  const handlePlanChange = async (newPlan: Plan) => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/pricing");
      return;
    }

    const planConfig = PLANS.find(p => p.key === newPlan);
    const downgrade = isDowngrade(currentPlan, newPlan);

    if (downgrade || newPlan === 'free') {
      // Downgrades should ideally happen in the Stripe Customer Portal
      handleOpenPortal();
      return;
    }

    setLoading(newPlan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: planConfig?.priceId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong.");
        setLoading(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setLoading(null);
    }
  };

  const handleOpenPortal = async () => {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.error || "Could not open billing portal.");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] relative overflow-hidden">
      {/* DECORATIVE BACKGROUND BLURS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-[80px]" />
      </div>

      <TopNav
        isLoggedIn={isLoggedIn}
        onLogout={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
      />

      <div className="px-6 py-24 relative z-10">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* HEADER */}
          <div className="text-center space-y-6 animate-fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              Pricing Transparency
            </div>

            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white">
              Choose your <span className="text-indigo-600">Expert</span> Plan
            </h1>
            <p className="mt-4 text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Unlock the full potential of your influence with deep cross-platform analytics and growth tools.
            </p>
          </div>

          {/* PLANS GRID */}
          <div className="grid gap-10 md:grid-cols-3 reveal">
            {PLANS.map((plan, idx) => {
              const isCurrent = currentPlan === plan.key;
              const downgrade = isDowngrade(currentPlan, plan.key);
              const isPro = plan.key === 'pro';
              const isAgency = plan.key === 'agency';

              return (
                <div
                  key={plan.key}
                  className={`
                    glass group relative rounded-[3rem] p-10 border-2 transition-all duration-500 flex flex-col
                    ${plan.highlight
                      ? "border-indigo-500/50 scale-105 shadow-2xl shadow-indigo-500/20 z-20"
                      : "border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 z-10"}
                    ${isCurrent ? "ring-4 ring-indigo-500/20" : ""}
                  `}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {plan.highlight && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/40 border border-indigo-400/30 animate-pulse">
                      Most Popular
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {plan.name}
                    </h3>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-lg font-bold text-slate-400">/month</span>
                    </div>
                    <p className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      {plan.description}
                    </p>
                  </div>

                  <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-8" />

                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPro || isAgency ? "bg-indigo-600 shadow-lg shadow-indigo-600/30" : "bg-slate-200 dark:bg-slate-800"}`}>
                          <svg className={`w-3 h-3 ${isPro || isAgency ? "text-white" : "text-indigo-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* BUTTON */}
                  <div className="mt-10">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full rounded-[1.5rem] bg-slate-100 dark:bg-slate-800/50 py-4 text-slate-400 font-black uppercase text-xs tracking-widest cursor-not-allowed border-2 border-transparent"
                      >
                        Current Plan
                      </button>
                    ) : downgrade ? (
                      <button
                        onClick={() => setPendingDowngrade(plan.key)}
                        className="w-full rounded-[1.5rem] border-2 border-slate-200 dark:border-slate-800 py-4 font-black uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-slate-600 dark:text-slate-300"
                      >
                        Switch to {plan.name}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlanChange(plan.key)}
                        disabled={loading !== null}
                        className={`
                          w-full rounded-[1.5rem] py-5 font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 active:scale-95 disabled:opacity-50
                          ${plan.highlight
                            ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500"
                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl dark:hover:shadow-white/10"}
                        `}
                      >
                        {loading === plan.key ? "Processing..." : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-8 bg-indigo-600/5 rounded-[3rem] border border-indigo-600/10 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto animate-fadeUp">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-center md:text-left">
              <strong className="text-slate-900 dark:text-white font-black">Flexible Growth.</strong> You can upgrade or downgrade your plan at any time. Changes are reflected immediately in your dashboard metrics. Need help choosing?
              <a href="mailto:support@crealytix.com" className="text-indigo-600 font-bold ml-1 hover:underline">Contact our experts</a>.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR MODAL */}
      <AlertModal
        open={!!errorMessage}
        title="Cannot process request"
        message={errorMessage ?? ""}
        variant="danger"
        buttonLabel="Understood"
        onClose={() => setErrorMessage(null)}
      />

      {/* CONFIRM DOWNGRADE */}
      <ConfirmModal
        open={!!pendingDowngrade}
        title="Confirm Downgrade"
        description={`Are you sure you want to downgrade to ${pendingDowngrade?.toUpperCase()} plan? This might affect your account tracking limits.`}
        variant="danger"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onCancel={() => setPendingDowngrade(null)}
        onConfirm={() => {
          if (pendingDowngrade) {
            handlePlanChange(pendingDowngrade);
            setPendingDowngrade(null);
          }
        }}
      />
    </main>
  );
}
