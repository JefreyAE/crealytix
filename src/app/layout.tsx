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
      <body>{children}</body>
    </html>
  )
}
