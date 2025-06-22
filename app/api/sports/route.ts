import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const sports = await db.collection(COLLECTIONS.SPORTS).find({}).sort({ name: 1 }).toArray()

    return NextResponse.json({
      sports: sports.map((sport) => ({
        name: sport.name,
        category: sport.category,
        popularity: sport.popularity,
        positions: sport.positions || sport.events || [],
        governing_body: sport.governing_body,
      })),
    })
  } catch (error) {
    console.error("Sports API error:", error)
    return NextResponse.json({ error: "Failed to fetch sports" }, { status: 500 })
  }
}
