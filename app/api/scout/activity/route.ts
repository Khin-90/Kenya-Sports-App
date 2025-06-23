// app/api/scout/activity/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { ScoutView, ContactRequest } from "@/lib/models/ScoutView"; // Corrected import
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// If you need the User model here, import it from "@/lib/models/User"
// import { User } from "@/lib/models/User";

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000); // Fixed: Added missing ')'
  
  if (seconds < 60) return "just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export async function GET() {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scoutId = session.user.id;

    const [profileViews, contactRequests] = await Promise.all([
      ScoutView.find({ scoutId })
        .sort({ viewedAt: -1 })
        .limit(3)
        .populate('playerId'),
      ContactRequest.find({ scoutId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('playerId')
    ]);

    const activities = [
      ...profileViews.map(view => ({
        type: "profile_view",
        player: `${view.playerId.firstName} ${view.playerId.lastName}`,
        time: formatTimeAgo(view.viewedAt),
        status: "completed"
      })),
      ...contactRequests.map(request => ({
        type: request.status === "APPROVED" ? "contact_approved" : "contact_request",
        player: `${request.playerId.firstName} ${request.playerId.lastName}`,
        time: formatTimeAgo(request.createdAt),
        status: request.status.toLowerCase()
      }))
    ];

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching scout activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
