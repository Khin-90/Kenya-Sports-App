// app/api/scout/stats/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose"; // Correct import
import { ScoutView, ContactRequest } from "@/lib/models/ScoutView";
import { User } from "@/lib/models/users"; // Import User to ensure models are registered
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect(); // <--- CORRECTED: Call dbConnect()

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scoutId = session.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [playersViewed, contactRequestsPending, approvedContacts, activeProspects] = await Promise.all([
      ScoutView.countDocuments({ scoutId }),
      ContactRequest.countDocuments({ scoutId, status: "PENDING" }), // Renamed for clarity
      ContactRequest.countDocuments({ scoutId, status: "APPROVED" }),
      ContactRequest.countDocuments({ 
        scoutId, 
        status: "APPROVED",
        // Ensure lastContactDate exists and is greater than or equal to thirtyDaysAgo
        lastContactDate: { $gte: thirtyDaysAgo } 
      })
    ]);

    return NextResponse.json([
      { label: "Players Viewed", value: playersViewed },
      { label: "Contact Requests", value: contactRequestsPending }, // Use the pending count here
      { label: "Approved Contacts", value: approvedContacts },
      { label: "Active Prospects", value: activeProspects }
    ]);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
