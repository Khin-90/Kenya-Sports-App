import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get("sport")
    const county = searchParams.get("county")
    const ageGroup = searchParams.get("ageGroup")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const filters: any = {}

    if (sport && sport !== "all") {
      filters.sport = sport
    }

    if (county && county !== "all") {
      filters.county = county
    }

    if (ageGroup && ageGroup !== "all") {
      filters.ageGroup = ageGroup
    }

    filters.limit = limit

    const players = await db.getLeaderboard(filters)

    // Calculate age and add rank
    const playersWithAge = players.map((player, index) => {
      const age = new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()
      return {
        ...player,
        age,
        rank: index + 1,
        // Remove sensitive information
        passwordHash: undefined,
        phone: undefined,
        email: player.privacySettings?.showPersonalInfo ? player.email : undefined,
      }
    })

    return NextResponse.json({
      players: playersWithAge,
      total: playersWithAge.length,
    })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
