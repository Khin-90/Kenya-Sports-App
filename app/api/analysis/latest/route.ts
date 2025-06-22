import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { VideoAnalysisResult } from "@/lib/ai-analysis"; // Changed import
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Analysis from "@/lib/models/Analysis"; // You'll need this model
import Video from "@/lib/models/Video"; // You'll need this model

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const latestAnalysis = await Analysis.aggregate([ // Changed from AIAnalysis to Analysis
      {
        $lookup: {
          from: "videos",
          localField: "videoId",
          foreignField: "_id",
          as: "video"
        }
      },
      { $unwind: "$video" },
      { 
        $match: { 
          "video.playerId": new mongoose.Types.ObjectId(session.user.id) 
        } 
      },
      { $sort: { createdAt: -1 } },
      { $limit: 1 }
    ]);

    if (!latestAnalysis.length) {
      return NextResponse.json(
        { message: "No analysis found" }, 
        { status: 404 }
      );
    }

    const result = {
      ...latestAnalysis[0],
      _id: latestAnalysis[0]._id.toString(),
      videoId: latestAnalysis[0].videoId.toString(),
      video: {
        ...latestAnalysis[0].video,
        _id: latestAnalysis[0].video._id.toString(),
        playerId: latestAnalysis[0].video.playerId.toString()
      },
      createdAt: latestAnalysis[0].createdAt.toISOString(),
      updatedAt: latestAnalysis[0].updatedAt?.toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching latest analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}