"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Plan = "free" | "pro" | "agency";

const planOrder: Record<Plan, number> = {
    free: 0,
    pro: 1,
    agency: 2,
};

export default function PricingPage() {
    const router = useRouter();

    const [currentPlan, setCurrentPlan] = useState<Plan>("free");
    const [loading, setLoading] = useState<Plan | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pendingDowngrade, setPendingDowngrade] = useState<Plan | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 🔍 Detectar usuario y plan
    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setIsLoggedIn(false);
                return;
            }

            setIsLoggedIn(true);

            const { data } = await supabase
                .from("profiles")
                .select("plan")
                .eq("id", user.id)
                .single();

            if (data?.plan) {
                setCurrentPlan(data.plan as Plan);
            }
        };

        fetchUser();
    }, []);

    // 📦 Límite por plan
    const getAccountLimit = (plan: Plan) => {
        switch (plan) {
            case "free":
                return 1;
            case "pro":
                return 5;
            case "agency":
                return Infinity;
        }
    };

    // 🚀 Update plan
    const updatePlan = async (newPlan: Plan) => {
        setLoading(newPlan);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        await supabase
            .from("profiles")
            .update({ plan: newPlan })
            .eq("id", user.id);

        router.push("/dashboard");
        router.refresh();
    };

    // 🔽 Downgrade con validación
    const handleDowngrade = async (newPlan: Plan) => {
        setLoading(newPlan);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: metrics } = await supabase
            .from("metrics")
            .select("id")
            .eq("user_id", user.id);

        const currentAccounts = metrics?.length || 0;
        const newLimit = getAccountLimit(newPlan);

        if (currentAccounts > newLimit) {
            setErrorMessage(
                `You currently have ${currentAccounts} connected accounts.

The ${newPlan.toUpperCase()} plan allows only ${newLimit} account(s).

Please remove some accounts before downgrading.`
            );
            setLoading(null);
            return;
        }

        setPendingDowngrade(newPlan);
        setLoading(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const plans = [
        {
            name: "Free",
            key: "free" as Plan,
            price: "$0",
            description: "Perfect to get started",
            features: [
                "1 account",
                "Basic analytics",
                "Weekly growth tracking",
            ],
        },
        {
            name: "Pro",
            key: "pro" as Plan,
            price: "$19",
            description: "For serious creators",
            features: [
                "Up to 5 accounts",
                "Advanced analytics",
                "Growth insights",
                "Priority support",
            ],
            highlight: true,
        },
        {
            name: "Agency",
            key: "agency" as Plan,
            price: "$49",
            description: "For teams & agencies",
            features: [
                "Unlimited accounts",
                "All Pro features",
                "Team management",
                "Future AI tools",
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-zinc-900 dark:to-black">

            {/* TOP NAV */}
            <div className="w-full border-b bg-white/70 backdrop-blur-md dark:bg-zinc-900/70 dark:border-zinc-800">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">

                    <button
                        onClick={() => router.push("/")}
                        className="text-lg font-bold tracking-tight"
                    >
                        Crealytix
                    </button>

                    <div className="flex items-center gap-4">
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
                                onClick={handleLogout}
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

            {/* CONTENT */}
            <div className="px-6 py-24">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Choose your plan
                        </h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            Upgrade anytime. Cancel anytime.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {plans.map((plan) => {
                            const isCurrent = currentPlan === plan.key;
                            const isDowngrade =
                                planOrder[plan.key] < planOrder[currentPlan];

                            return (
                                <div
                                    key={plan.key}
                                    className={`relative rounded-2xl p-8 border shadow-sm transition ${plan.highlight
                                            ? "border-indigo-600 scale-105 shadow-lg"
                                            : "border-gray-200 dark:border-gray-800"
                                        }`}
                                >
                                    {plan.highlight && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 text-white text-xs px-3 py-1">
                                            Most Popular
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

                                    {isCurrent ? (
                                        <button
                                            disabled
                                            className="mt-8 w-full rounded-xl bg-gray-300 dark:bg-zinc-700 py-3 text-gray-600 dark:text-gray-300 font-medium cursor-not-allowed"
                                        >
                                            Current Plan
                                        </button>
                                    ) : isDowngrade ? (
                                        <button
                                            onClick={() => handleDowngrade(plan.key)}
                                            className="mt-8 w-full rounded-xl border border-gray-300 dark:border-gray-700 py-3 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                                        >
                                            Downgrade to {plan.name}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => updatePlan(plan.key)}
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
            {errorMessage && (
                <div
                    onClick={() => setErrorMessage(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl space-y-6"
                    >
                        <h3 className="text-xl font-semibold">
                            Cannot downgrade
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {errorMessage}
                        </p>

                        <button
                            onClick={() => setErrorMessage(null)}
                            className="w-full rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}

            {/* CONFIRM MODAL */}
            {pendingDowngrade && (
                <div
                    onClick={() => setPendingDowngrade(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl space-y-6"
                    >
                        <h3 className="text-xl font-semibold">
                            Confirm Downgrade
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to downgrade to{" "}
                            <span className="font-semibold capitalize">
                                {pendingDowngrade}
                            </span>{" "}
                            plan?
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setPendingDowngrade(null)}
                                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 py-3 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await updatePlan(pendingDowngrade);
                                    setPendingDowngrade(null);
                                }}
                                className="flex-1 rounded-xl bg-red-600 py-3 text-white font-medium hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
