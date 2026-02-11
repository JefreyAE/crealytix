import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan || "free";

  const { data: metrics } = await supabase
    .from("metrics")
    .select("id")
    .eq("user_id", user.id);

  const accountCount = metrics?.length || 0;

  const getAccountLimit = (plan: string) => {
    switch (plan) {
      case "free":
        return 1;
      case "pro":
        return 5;
      case "agency":
        return Infinity;
      default:
        return 1;
    }
  };

  const accountLimit = getAccountLimit(plan);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <DashboardSidebar
        email={user.email!}
        fullName={profile?.full_name}
        avatarUrl={profile?.avatar_url}
        plan={profile?.plan || "free"}
        accountCount={metrics?.length || 0}
        accountLimit={accountLimit}
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
