import { Plan } from "@/lib/services/plan.service";

export const PLANS = [
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
    priceId: "", // Free plan doesn't need checkout
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
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro_placeholder",
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
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || "price_agency_placeholder",
  },
];
