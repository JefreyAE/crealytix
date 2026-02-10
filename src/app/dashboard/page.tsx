import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="mb-6 text-xl font-bold">Crealytix</h2>

        <nav className="space-y-2">
          <Link href="/dashboard">Overview</Link>
        </nav>

        <div className="mt-10">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
