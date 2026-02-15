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

  /* ------------------------------------------ */
  /* PLAN CHANGE */
  /* ------------------------------------------ */

  const handlePlanChange = async (newPlan: Plan) => {
    setLoading(newPlan);

    try {
      const res = await fetch("/api/plan/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: newPlan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong.");
        setLoading(null);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setLoading(null);
    }
  };

  /* ------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------ */

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-zinc-900 dark:to-black">

      <TopNav
        isLoggedIn={isLoggedIn}
        onLogout={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
      />

      <div className="px-6 py-24">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight">
              Choose your plan
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Upgrade anytime. Cancel anytime.
            </p>
          </div>

          {/* PLANS GRID */}
          <div className="grid gap-8 md:grid-cols-3">
            {PLANS.map((plan) => {
              const isCurrent = currentPlan === plan.key;
              const downgrade = isDowngrade(
                currentPlan,
                plan.key
              );

              return (
                <div
                  key={plan.key}
                  className={`
                    relative rounded-2xl p-8 border shadow-sm transition
                    ${
                      plan.highlight
                        ? "border-indigo-600 scale-105 shadow-lg"
                        : "border-gray-200 dark:border-gray-800"
                    }
                    ${
                      isCurrent
                        ? "ring-2 ring-indigo-600"
                        : ""
                    }
                  `}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 text-white text-xs px-3 py-1">
                      Most Popular
                    </span>
                  )}

                  {isCurrent && (
                    <span className="absolute top-4 right-4 text-xs bg-green-600 text-white px-2 py-1 rounded-md">
                      Active
                    </span>
                  )}

                  <h3 className="text-xl font-semibold">
                    {plan.name}
                  </h3>

                  <p className="mt-4 text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-500">
                      /month
                    </span>
                  </p>

                  <p className="mt-2 text-gray-500">
                    {plan.description}
                  </p>

                  <ul className="mt-6 space-y-2 text-gray-600 dark:text-gray-400">
                    {plan.features.map((feature, i) => (
                      <li key={i}>✔ {feature}</li>
                    ))}
                  </ul>

                  {/* BUTTON */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="mt-8 w-full rounded-xl bg-gray-300 dark:bg-zinc-700 py-3 text-gray-600 dark:text-gray-300 font-medium cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : downgrade ? (
                    <button
                      onClick={() =>
                        setPendingDowngrade(plan.key)
                      }
                      className="mt-8 w-full rounded-xl border border-gray-300 dark:border-gray-700 py-3 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                    >
                      Downgrade to {plan.name}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handlePlanChange(plan.key)
                      }
                      disabled={loading !== null}
                      className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-white font-medium transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                    >
                      {loading === plan.key
                        ? "Processing..."
                        : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
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
        description={`Are you sure you want to downgrade to ${pendingDowngrade?.toUpperCase()} plan?`}
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
