import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { AIAnalysis, Video } from "@/lib/mongoose/models";
import { analyzePlayerVideo } from "@/lib/ai-analysis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoUrl, sport, position, age, videoId } = await req.json();

    if (!videoUrl || !videoId) {
      return NextResponse.json(
        { error: "Missing videoUrl or videoId" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify video exists and belongs to user
    const video = await Video.findOne({
      _id: videoId,
      playerId: session.user.id
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      );
    }

    // Perform analysis
    const result = await analyzePlayerVideo(videoUrl, sport, position, age);

    // Save analysis
    const analysis = await AIAnalysis.create({
      videoId,
      playerId: session.user.id,
      ...result,
      metadata: {
        sport,
        position,
        age,
        analyzedAt: new Date()
      }
    });

    // Update video with analysis reference
    await Video.findByIdAndUpdate(videoId, {
      hasAnalysis: true,
      lastAnalyzedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      analysisId: analysis._id,
      ...result
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: error.message },
      { status: 500 }
    );
  }
}