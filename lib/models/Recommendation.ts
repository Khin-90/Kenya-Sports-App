import { User, Video, Analysis } from "@/lib/models/Recommendation"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  
  const session = await getSession({ req })
  if (!session || session.user.role !== "SCOUT") {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const scout = await User.findById(session.user.id)
    
    // Get players with their latest analysis
    const recommendedPlayers = await User.aggregate([
      { $match: { 
        role: "player",
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
    ])

    res.status(200).json(recommendedPlayers.map(player => ({
      id: player._id,
      name: `${player.firstName} ${player.lastName}`,
      sport: player.sport,
      position: player.position,
      county: player.county,
      age: calculateAge(player.dateOfBirth),
      aiScore: player.overallScore,
      avatar: player.profileImageUrl || "/placeholder.svg"
    })))
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}