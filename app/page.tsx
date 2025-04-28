import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "My Cutie's Cycle",
  description: "A cute period tracker for your partner.",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Dashboard />
    </main>
  )
}
