import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { RoleProvider } from "@/components/role-access-control"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
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
