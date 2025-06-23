// app/api/scout/recommendations/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/lib/models/users"; // This import is correct for the User model
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function calculateAge(birthDate: Date) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export async function GET() {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scout = await User.findById(session.user.id);
    if (!scout || scout.role !== "SCOUT") { // Ensure "SCOUT" matches your User model's role enum
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const recommendedPlayers = await User.aggregate([
      { $match: { 
        role: "PLAYER", // Ensure "PLAYER" matches your User model's role enum
        ...(scout.preferredSports && { sport: { $in: scout.preferredSports } }),
        ...(scout.preferredCounties && { county: { $in: scout.preferredCounties } })
      }},
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "playerId",
          as: "videos"
        }
      },
      { $unwind: "$videos" },
      {
        $lookup: {
          from: "analyses",
          localField: "videos._id",
          foreignField: "videoId",
          as: "analyses"
        }
      },
      { $unwind: "$analyses" },
      { $sort: { "analyses.result.overallScore": -1 } },
      { $limit: 5 },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          sport: 1,
          position: 1,
          county: 1,
          dateOfBirth: 1,
          profileImageUrl: 1,
          overallScore: "$analyses.result.overallScore"
        }
      }
    ]);

    return NextResponse.json(recommendedPlayers.map(player => ({
      id: player._id,
      name: `${player.firstName} ${player.lastName}`,
      sport: player.sport,
      position: player.position,
      county: player.county,
      age: calculateAge(player.dateOfBirth),
      aiScore: player.overallScore,
      avatar: player.profileImageUrl || "/placeholder.svg"
    })));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
