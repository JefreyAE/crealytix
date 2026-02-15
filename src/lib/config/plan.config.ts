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
