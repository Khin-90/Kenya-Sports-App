// app/api/scout/stats/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { ScoutView, ContactRequest } from "@/lib/models/ScoutView"; // Corrected import
// If you need the User model here, import it from "@/lib/models/User"
// import { User } from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scoutId = session.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [playersViewed, contactRequests, approvedContacts, activeProspects] = await Promise.all([
      ScoutView.countDocuments({ scoutId }),
      ContactRequest.countDocuments({ scoutId, status: "PENDING" }),
      ContactRequest.countDocuments({ scoutId, status: "APPROVED" }),
      ContactRequest.countDocuments({ 
        scoutId, 
        status: "APPROVED",
        lastContactDate: { $gte: thirtyDaysAgo }
      })
    ]);

    return NextResponse.json([
      { label: "Players Viewed", value: playersViewed },
      { label: "Contact Requests", value: contactRequests },
      { label: "Approved Contacts", value: approvedContacts },
      { label: "Active Prospects", value: activeProspects }
    ]);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
