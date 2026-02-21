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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-indigo-500/30 overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <DashboardSidebar
        email={user.email ?? ""}
        fullName={profile?.full_name ?? undefined}
        avatarUrl={profile?.avatar_url ?? undefined}
        plan={plan}
        accountCount={channels.length}
        accountLimit={planConfig.maxAccounts}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center px-8 z-20">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Analytics Center
            </h1>
          </div>
        </header>
        <main className="p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fadeUp">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
