import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { RoleProvider } from "@/components/role-access-control"

export const metadata: Metadata = {
  title: "NexaProject",
  description: "Created with v0",
  generator: "v0.dev",
  icons: {
    icon: "/pro.png", // ← Tambahkan ini
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  )
}
