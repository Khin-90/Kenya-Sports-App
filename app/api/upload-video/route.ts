// app/api/upload-video/route.ts

import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary"; // Assuming this exists and works
import { dbConnect } from "@/lib/mongoose";
import Video from "@/lib/models/Video"; // Assuming Video is default exported from lib/models/Video.ts
import { PlayerModel } from "@/lib/models/users"; // Import PlayerModel discriminator
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AIAnalysis } from "@/lib/ai-analysis"; // Assuming this is your AI analysis service class

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // It's generally safer to check for session.user.id as that's what you'll use for playerId
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("video") as File;
  const title = formData.get("title") as string || "Untitled Video";
  // Assuming you'll pass these from the frontend form as well
  const description = formData.get("description") as string || "";
  const isPublic = formData.get("isPublic") === "true"; // Convert string to boolean

  if (!file) {
    return NextResponse.json({ error: "No video file provided" }, { status: 400 });
  }

  await dbConnect();

  try {
    // --- FETCH PLAYER DETAILS TO GET SPORT, POSITION, AGE ---
    const playerId = session.user.id;
    const player = await PlayerModel.findById(playerId);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Crucial validation: Ensure player has required sport/position data
    if (!player.sport) {
      return NextResponse.json(
        { error: "Player profile missing required 'sport' information. Please update your profile." },
        { status: 400 }
      );
    }
    // You might want to add similar checks for player.position and player.dateOfBirth if they are critical
    // --- END FETCH PLAYER DETAILS ---

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const cloudinaryRes = await uploadToCloudinary(buffer, filename);

    // --- CORRECTED VIDEO.CREATE CALL ---
    const video = await Video.create({
      playerId: playerId, // Use the ID from the session
      title,
      description: description, // Include description
      videoUrl: cloudinaryRes.secure_url,
      cloudinaryId: cloudinaryRes.public_id,
      thumbnailUrl: cloudinaryRes.secure_url.replace(/\.mp4$/, '.jpg'), // Basic thumbnail URL
      durationSeconds: Math.round(cloudinaryRes.duration), // Assuming cloudinaryRes has duration
      fileSizeMB: (cloudinaryRes.bytes / (1024 * 1024)).toFixed(2), // Assuming cloudinaryRes has bytes
      uploadStatus: "processing", // Set to processing initially for AI analysis
      isPublic: isPublic, // Use the boolean from form data
      
      // --- IMPORTANT: Include required fields from player object ---
      sport: player.sport,
      position: player.position,
      age: calculateAge(player.dateOfBirth), // Calculate age
      // --- END IMPORTANT ---

      metadata: {
        originalFilename: file.name,
        size: file.size,
        type: file.type,
      }
    });
    // --- END CORRECTED VIDEO.CREATE CALL ---

    // --- TRIGGER AI ANALYSIS ---
    const aiAnalyzer = new AIAnalysis();
    aiAnalyzer.analyzePlayerVideo(
      video.videoUrl,
      video.sport,
      video.position || 'unknown', // Provide a default if position can be undefined
      video.age || 0, // Provide a default if age can be undefined
      video._id.toString()
    ).catch(err => {
      console.error(`Background AI analysis failed for video ${video._id}:`, err);
      // Update video status to failed if analysis fails
      Video.findByIdAndUpdate(video._id, { uploadStatus: "failed" }).exec();
    });
    // --- END TRIGGER AI ANALYSIS ---

    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully and analysis started!",
      url: cloudinaryRes.secure_url,
      videoId: video._id,
      title: video.title
    });

  } catch (error: any) { // Catch as any to access .message
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate age (ensure this is available or imported)
function calculateAge(dateOfBirth: Date | string): number {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const diff_ms = Date.now() - dob.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}
