import mongoose, { Schema, models } from "mongoose";

const videoSchema = new Schema(
  {
    playerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: String,
    description: String,
    videoUrl: String,
    cloudinaryId: String,
    thumbnailUrl: String,
    durationSeconds: Number,
    fileSizeMB: Number,
    uploadStatus: { type: String, enum: ["processing", "completed", "failed"], default: "completed" },
    isPublic: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const aiAnalysisSchema = new Schema(
  {
    videoId: { type: Schema.Types.ObjectId, required: true, ref: "Video" },
    overallScore: Number,
    technicalSkills: Number,
    physicalAttributes: Number,
    tacticalAwareness: Number,
    mentalStrength: Number,
    strengths: [String],
    areasForImprovement: [String],
    recommendations: [String],
    detailedAnalysis: String,
    analysisVersion: { type: String, default: "v1" },
    processingTimeSeconds: Number,
  },
  { timestamps: true }
);

export const Video = models.Video || mongoose.model("Video", videoSchema);
export const AIAnalysis = models.AIAnalysis || mongoose.model("AIAnalysis", aiAnalysisSchema);
