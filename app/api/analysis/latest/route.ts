// app/api/analysis/latest/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Analysis from "@/lib/models/Analysis";
import Video from "@/lib/models/Video";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First find the latest video for this player
    const latestVideo = await Video.findOne({ 
      playerId: new mongoose.Types.ObjectId(session.user.id) 
    })
    .sort({ createdAt: -1 });

    if (!latestVideo) {
      console.log("No videos found for user:", session.user.id);
      return NextResponse.json(
        { message: "No videos found for this player" }, 
        { status: 404 }
      );
    }

    // Then find the analysis for this video
    const latestAnalysis = await Analysis.findOne({
      videoId: latestVideo._id
    })
    .sort({ createdAt: -1 });

    if (!latestAnalysis) {
      console.log("No analysis found for video:", latestVideo._id);
      return NextResponse.json(
        { 
          message: "Analysis not completed yet",
          videoId: latestVideo._id.toString()
        }, 
        { status: 404 }
      );
    }

    // Populate video details if needed
    const populatedVideo = await Video.findById(latestVideo._id)
      .select("title playerId createdAt");

    const result = {
      // Spread the analysis result fields to root level
      ...latestAnalysis.result.toObject(),
      _id: latestAnalysis._id.toString(),
      videoId: latestAnalysis.videoId.toString(),
      video: {
        _id: populatedVideo._id.toString(),
        playerId: populatedVideo.playerId.toString(),
        title: populatedVideo.title,
        createdAt: populatedVideo.createdAt.toISOString()
      },
      createdAt: latestAnalysis.createdAt.toISOString(),
      updatedAt: latestAnalysis.updatedAt?.toISOString(),
      analysisVersion: latestAnalysis.result?.analysisVersion || "v1"
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/analysis/latest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}