import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get("sport")
    const county = searchParams.get("county")
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const db = await getDatabase()
    const query: any = { isActive: true }

    if (sport && sport !== "all") {
      query.sport = { $regex: sport, $options: "i" }
    }

    if (county && county !== "all") {
      query.county = { $regex: county, $options: "i" }
    }

    if (type && type !== "all") {
      query.opportunityType = type
    }

    const opportunities = await db
      .collection(COLLECTIONS.OPPORTUNITIES)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({
      opportunities: opportunities.map((opp) => ({
        ...opp,
        _id: opp._id.toString(),
        createdBy: opp.createdBy.toString(),
      })),
      total: opportunities.length,
    })
  } catch (error) {
    console.error("Opportunities API error:", error)
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 })
  }
}
