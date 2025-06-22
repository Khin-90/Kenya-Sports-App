import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { AIAnalysis, Video } from "@/lib/mongoose/models";
import { analyzePlayerVideo } from "@/lib/ai-analysis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // Start database connection
    await connectToDatabase();

    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const { videoUrl, sport, position, age, videoId } = await req.json();

    if (!videoUrl || !sport || !position || !age || !videoId) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          missingFields: {
            videoUrl: !videoUrl,
            sport: !sport,
            position: !position,
            age: !age,
            videoId: !videoId
          }
        },
        { status: 400 }
      );
    }

    // Validate videoId format
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return NextResponse.json(
        { error: "Invalid videoId format" },
        { status: 400 }
      );
    }

    // Verify video exists and belongs to user
    const video = await Video.findOne({
      _id: videoId,
      playerId: session.user.id
    }).lean();

    if (!video) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      );
    }

    // Update video status to "processing" before analysis
    await Video.findByIdAndUpdate(videoId, {
      uploadStatus: "processing",
      updatedAt: new Date()
    });

    // Perform analysis with error handling
    let result;
    try {
      result = await analyzePlayerVideo(videoUrl, sport, position, age, videoId);
    } catch (analysisError) {
      console.error("Video analysis failed:", analysisError);
      await Video.findByIdAndUpdate(videoId, {
        uploadStatus: "failed",
        updatedAt: new Date()
      });
      throw new Error(`Analysis service failed: ${analysisError.message}`);
    }

    // Create analysis record
    const analysis = await AIAnalysis.create({
      videoId: new mongoose.Types.ObjectId(videoId),
      playerId: new mongoose.Types.ObjectId(session.user.id),
      result: {
        ...result,
        analysisVersion: "v1"
      },
      createdAt: new Date()
    });

    // Update video status and analysis reference
    await Video.findByIdAndUpdate(videoId, {
      uploadStatus: "completed",
      hasAnalysis: true,
      lastAnalyzedAt: new Date(),
      updatedAt: new Date(),
      analysisId: analysis._id
    });

    return NextResponse.json({
      success: true,
      analysisId: analysis._id,
      videoId: videoId,
      status: "completed",
      ...result
    });

  } catch (error) {
    console.error("Analysis endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}