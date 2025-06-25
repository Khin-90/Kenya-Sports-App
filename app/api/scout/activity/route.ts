// app/api/scout/activity/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose"; // Correct import
import { ScoutView, ContactRequest } from "@/lib/models/ScoutView";
import { User } from "@/lib/models/users"; // Import the base User model to ensure discriminators are registered
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
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
    await dbConnect(); // <--- CORRECTED: Call dbConnect()

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scoutId = session.user.id;

    // Fetch profile views and contact requests
    const [profileViews, contactRequests] = await Promise.all([
      ScoutView.find({ scoutId })
        .sort({ viewedAt: -1 })
        .limit(3)
        .populate({
          path: 'playerId',
          model: User, // Specify the base User model for population
          select: 'firstName lastName' // Select only necessary fields
        }),
      ContactRequest.find({ scoutId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate({
          path: 'playerId',
          model: User, // Specify the base User model for population
          select: 'firstName lastName' // Select only necessary fields
        })
    ]);

    // Combine and format activities
    const activities = [
      ...profileViews.map(view => ({
        type: "profile_view",
        // Ensure playerId is populated before accessing its properties
        player: view.playerId ? `${(view.playerId as any).firstName} ${(view.playerId as any).lastName}` : 'Unknown Player',
        time: formatTimeAgo(view.viewedAt),
        status: "completed"
      })),
      ...contactRequests.map(request => ({
        type: request.status === "APPROVED" ? "contact_approved" : "contact_request",
        // Ensure playerId is populated before accessing its properties
        player: request.playerId ? `${(request.playerId as any).firstName} ${(request.playerId as any).lastName}` : 'Unknown Player',
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
