// app/api/player/route.ts (App Router) or pages/api/player.ts (Pages Router)
import { NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const db = await getDatabase()

    // Assuming you want the first/only player for now (since you're the only one in DB)
    const player = await db.collection(COLLECTIONS.PLAYERS).findOne({ role: "player" })

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error("❌ Error fetching player data:", error)
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 })
  }
}
