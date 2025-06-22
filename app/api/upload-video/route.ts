import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongoose";
import { Video } from "@/lib/mongoose/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("video") as File;
  const title = formData.get("title") as string || "Untitled Video";

  if (!file) {
    return NextResponse.json({ error: "No video file provided" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const cloudinaryRes = await uploadToCloudinary(buffer, filename);

    const video = await Video.create({
      playerId: session.user.id, // Assuming user.id is the playerId
      title,
      videoUrl: cloudinaryRes.secure_url,
      cloudinaryId: cloudinaryRes.public_id,
      uploadStatus: "completed",
      isPublic: true,
      metadata: {
        originalFilename: file.name,
        size: file.size,
        type: file.type,
      }
    });

    return NextResponse.json({ 
      success: true,
      url: cloudinaryRes.secure_url, 
      videoId: video._id,
      title: video.title
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}