// app/api/scout/recommendations/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose"; // Assuming this connects Mongoose
import { User } from "@/lib/models/users"; // Correct import for User model (base for Player discriminator)

import Video from "@/lib/models/Video"; // Correct: Default import for Video
import Analysis from "@/lib/models/Analysis"; // Correct: Default import for the Mongoose Analysis model

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Define consistency parameters
const CONSISTENCY_PERIOD_MONTHS = 3;
const MIN_CONSISTENCY_SCORE = 75;
const MIN_ANALYSES_FOR_CONSISTENCY = 2;

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
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json([], { status: 401 });
    }

    const scout = await User.findById(session.user.id);
    if (!scout || scout.role !== "scout") {
      return NextResponse.json([], { status: 403 });
    }
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - CONSISTENCY_PERIOD_MONTHS);

    const recommendedPlayers = await User.aggregate([
      { $match: { 
        role: "player",
        ...(scout.preferredSports && { sport: { $in: scout.preferredSports } }),
        ...(scout.preferredCounties && { county: { $in: scout.preferredCounties } })
      }},
      {
        $lookup: {
          from: Video.collection.name,
          localField: "_id",
          foreignField: "playerId",
          as: "videos"
        }
      },
      { $unwind: "$videos" },
      {
        $lookup: {
          from: Analysis.collection.name,
          localField: "videos._id",
          foreignField: "videoId",
          as: "analyses"
        }
      },
      { $unwind: "$analyses" },
      {
        $match: {
          "analyses.createdAt": { $gte: threeMonthsAgo }
        }
      },
      {
        $group: {
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          sport: { $first: "$sport" },
          position: { $first: "$position" },
          county: { $first: "$county" },
          dateOfBirth: { $first: "$dateOfBirth" },
          profileImageUrl: { $first: "$profileImageUrl" },
          recentAnalyses: { $push: "$analyses" },
          // CORRECTED PATH: overallScore is inside 'result'
          latestOverallScore: { $last: "$analyses.result.overallScore" } 
        }
      },
      {
        $addFields: {
          consistencyScore: {
            $cond: {
              if: { $gte: [{ $size: "$recentAnalyses" }, MIN_ANALYSES_FOR_CONSISTENCY] },
              // CORRECTED PATH: overallScore is inside 'result'
              then: { $avg: "$recentAnalyses.result.overallScore" }, 
              else: 0
            }
          }
        }
      },
      {
        $match: {
          consistencyScore: { $gte: MIN_CONSISTENCY_SCORE }
        }
      },
      { $sort: { consistencyScore: -1, latestOverallScore: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          sport: 1,
          position: 1,
          county: 1,
          dateOfBirth: 1,
          profileImageUrl: 1,
          overallScore: "$latestOverallScore",
          consistencyScore: 1
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
    return NextResponse.json([], { status: 500 });
  }
}
