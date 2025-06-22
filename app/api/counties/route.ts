import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const counties = await db.collection(COLLECTIONS.COUNTIES).find({}).sort({ name: 1 }).toArray()

    return NextResponse.json({
      counties: counties.map((county) => ({
        name: county.name,
        region: county.region,
        population: county.population,
      })),
    })
  } catch (error) {
    console.error("Counties API error:", error)
    return NextResponse.json({ error: "Failed to fetch counties" }, { status: 500 })
  }
}
