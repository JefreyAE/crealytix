export default function PlanBadge({ plan }: { plan: "free" | "pro" | "agency" }) {
  const styles = {
    agency: "bg-purple-600 text-white",
    pro: "bg-indigo-600 text-white",
    free: "bg-gray-200 text-gray-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${styles[plan]}`}
    >
      {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
    </span>
  );
}
