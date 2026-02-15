import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPlanConfig } from "./plan.service";

export type Plan = "free" | "pro" | "agency";

export async function getUserPlan(userId: string): Promise<Plan> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  return (data?.plan as Plan) ?? "free";
}

export async function getUserAccountCount(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("youtube_channels")
    .select("id")
    .eq("user_id", userId)
    .is("deleted_at", null);

  return data?.length ?? 0;
}

export async function canDowngrade(
  userId: string,
  newPlan: Plan
) {
  const currentAccounts = await getUserAccountCount(userId);
  const config = getPlanConfig(newPlan);

  if (currentAccounts > config.maxAccounts) {
    return {
      allowed: false,
      currentAccounts,
      maxAllowed: config.maxAccounts,
    };
  }

  return { allowed: true };
}

export async function updateUserPlan(
  userId: string,
  newPlan: Plan
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({ plan: newPlan })
    .eq("id", userId);

  if (error) throw error;
}
