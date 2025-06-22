"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { PlayerDashboard } from "@/components/dashboard/player-dashboard"
import { ScoutDashboard } from "@/components/dashboard/scout-dashboard"
import { ParentDashboard } from "@/components/dashboard/parent-dashboard"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer";

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect("/auth/login")
  }

  const renderDashboard = () => {
    switch (session.user.role) {
      case "player":
        return <PlayerDashboard />
      case "scout":
        return <ScoutDashboard />
      case "parent":
        return <ParentDashboard />
      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      {renderDashboard()}
    </div>
  )
}
