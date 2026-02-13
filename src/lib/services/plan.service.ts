export type Plan = "free" | "pro" | "agency";

type PlanConfig = {
  maxAccounts: number;
  features: {
    advancedAnalytics: boolean;
    aiInsights: boolean;
    multiPlatformCompare: boolean;
  };
};

const PLAN_CONFIG: Record<Plan, PlanConfig> = {
  free: {
    maxAccounts: 1,
    features: {
      advancedAnalytics: false,
      aiInsights: false,
      multiPlatformCompare: false,
    },
  },
  pro: {
    maxAccounts: 5,
    features: {
      advancedAnalytics: true,
      aiInsights: false,
      multiPlatformCompare: false,
    },
  },
  agency: {
    maxAccounts: Infinity,
    features: {
      advancedAnalytics: true,
      aiInsights: true,
      multiPlatformCompare: true,
    },
  },
};

export function getPlanConfig(plan: Plan) {
  return PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;
}

export function canAddAccount(plan: Plan, currentCount: number) {
  const config = getPlanConfig(plan);
  return currentCount < config.maxAccounts;
}
