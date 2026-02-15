import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  isDowngrade,
  getPlanConfig,
  Plan,
} from "@/lib/services/plan.service";
import { getUserYouTubeChannels } from "@/lib/repositories/youtube.repository";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { plan: newPlan } = await req.json();

  if (!newPlan) {
    return NextResponse.json(
      { error: "Plan is required" },
      { status: 400 }
    );
  }

  /* ------------------------------------------ */
  /* GET CURRENT PLAN */
  /* ------------------------------------------ */

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const currentPlan = profile?.plan as Plan;

  if (!currentPlan) {
    return NextResponse.json(
      { error: "Current plan not found" },
      { status: 400 }
    );
  }

  /* ------------------------------------------ */
  /* CHECK DOWNGRADE RULE */
  /* ------------------------------------------ */

  if (isDowngrade(currentPlan, newPlan)) {
    const channels = await getUserYouTubeChannels(user.id);
    const currentAccounts = channels.length;

    const newLimit = getPlanConfig(newPlan).maxAccounts;

    if (currentAccounts > newLimit) {
      return NextResponse.json(
        {
          error: `You currently have ${currentAccounts} connected accounts.

The ${newPlan.toUpperCase()} plan allows only ${newLimit} account(s).

Please remove some accounts before downgrading.`,
        },
        { status: 400 }
      );
    }
  }

  /* ------------------------------------------ */
  /* UPDATE PLAN */
  /* ------------------------------------------ */

  const { error } = await supabase
    .from("profiles")
    .update({ plan: newPlan })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
