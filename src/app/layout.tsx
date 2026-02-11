import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Crealytix | Social Analytics for Creators",
  description: "Analytics simples y claros para Instagram y YouTube.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-zinc-900 dark:to-black ">
        {children}
      </body>
    </html>
  )
}
