import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserYouTubeChannels } from "@/lib/repositories/youtube.repository";
import { getPlanConfig } from "@/lib/services/plan.service";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  /* ---------------- PROFILE ---------------- */

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";

  /* ---------------- YOUTUBE CHANNELS ---------------- */

  const channels = await getUserYouTubeChannels(user.id);

  /* ---------------- PLAN CONFIG ---------------- */

  const planConfig = getPlanConfig(plan);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <DashboardSidebar
        email={user.email ?? ""}
        fullName={profile?.full_name ?? undefined}
        avatarUrl={profile?.avatar_url ?? undefined}
        plan={plan}
        accountCount={channels.length}
        accountLimit={planConfig.maxAccounts}
      />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-[#111827] border-b dark:border-gray-800 flex items-center px-8 shadow-sm">
          <h1 className="text-lg font-semibold">
            Dashboard
          </h1>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
