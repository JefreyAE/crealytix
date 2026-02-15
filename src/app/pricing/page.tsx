import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/services/pricing.service";
import PricingClient from "@/components/pricing/PricingClient";

export default async function PricingPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <PricingClient currentPlan="free" isLoggedIn={false} />;
  }

  const currentPlan = await getUserPlan(user.id);

  return (
    <PricingClient
      currentPlan={currentPlan}
      isLoggedIn={true}
    />
  );
}
