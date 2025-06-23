// app/api/scout/recommendations/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose"; // Assuming this connects Mongoose
import { User } from "@/lib/models/users"; // Correct import for User model
import Analysis from "@/lib/models/Analysis"; // Correct import for Analysis model
import Video from "@/lib/models/Video"; // Correct import for Video model
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Define consistency parameters
const CONSISTENCY_PERIOD_MONTHS = 3; // Look at performance over the last 3 months
const MIN_CONSISTENCY_SCORE = 75; // Minimum average AI score for recommendation
const MIN_ANALYSES_FOR_CONSISTENCY = 2; // Minimum number of analyses in the period to calculate consistency

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
      // Return an empty array for unauthorized access to prevent client-side errors
      return NextResponse.json([], { status: 401 });
    }

    const scout = await User.findById(session.user.id);
    // Ensure scout exists and has the correct role (lowercase 'scout' to match schema)
    if (!scout || scout.role !== "scout") {
      // Return an empty array for forbidden access
      return NextResponse.json([], { status: 403 });
    }
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - CONSISTENCY_PERIOD_MONTHS);

    const recommendedPlayers = await User.aggregate([
      { $match: { 
        role: "player", // Changed to lowercase 'player' to match schema
        ...(scout.preferredSports && { sport: { $in: scout.preferredSports } }),
        ...(scout.preferredCounties && { county: { $in: scout.preferredCounties } })
      }},
      // Lookup all videos for the player
      {
        $lookup: {
          from: Video.collection.name, // Use Mongoose model's collection name (e.g., "videos")
          localField: "_id",
          foreignField: "playerId",
          as: "videos"
        }
      },
      // Unwind videos to get individual video IDs for analysis lookup
      { $unwind: "$videos" },
      // Lookup all analyses for each video
      {
        $lookup: {
          from: Analysis.collection.name, // Use Mongoose model's collection name (e.g., "analyses")
          localField: "videos._id",
          foreignField: "videoId",
          as: "analyses"
        }
      },
      // Unwind analyses to process each analysis document
      { $unwind: "$analyses" },
      // Filter analyses to only include those within the consistency period
      {
        $match: {
          "analyses.createdAt": { $gte: threeMonthsAgo }
        }
      },
      // Group by player to calculate consistency score
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
          // Collect all relevant analyses for the player within the period
          recentAnalyses: { $push: "$analyses" },
          // Get the latest overall score for display (assuming analyses are ordered by createdAt)
          latestOverallScore: { $last: "$analyses.result.overallScore" } 
        }
      },
      // Calculate consistency score (average of recent analyses)
      {
        $addFields: {
          consistencyScore: {
            $cond: {
              if: { $gte: [{ $size: "$recentAnalyses" }, MIN_ANALYSES_FOR_CONSISTENCY] },
              then: { $avg: "$recentAnalyses.result.overallScore" },
              else: 0 // If not enough analyses, set consistency score to 0 or null
            }
          }
        }
      },
      // Filter players based on consistency score
      {
        $match: {
          consistencyScore: { $gte: MIN_CONSISTENCY_SCORE }
        }
      },
      // Sort by consistency score (highest first), then by latest overall score
      { $sort: { consistencyScore: -1, latestOverallScore: -1 } },
      { $limit: 5 }, // Limit to top 5 consistent players
      {
        $project: {
          firstName: 1,
          lastName: 1,
          sport: 1,
          position: 1,
          county: 1,
          dateOfBirth: 1,
          profileImageUrl: 1,
          overallScore: "$latestOverallScore", // Use the latest score for display
          consistencyScore: 1 // Optionally include consistency score for debugging/display
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
      aiScore: player.overallScore, // This will be the latest score of a consistent player
      avatar: player.profileImageUrl || "/placeholder.svg"
    })));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // On any server error, return an empty array to prevent client-side .map() errors
    return NextResponse.json([], { status: 500 });
  }
}
