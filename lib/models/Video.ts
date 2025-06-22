// Video.ts
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  playerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  cloudinaryId: { type: String },
  thumbnailUrl: { type: String },
  durationSeconds: { type: Number },
  fileSizeMB: { type: Number },
  uploadStatus: { 
    type: String, 
    enum: ["processing", "completed", "failed"], 
    default: "processing" 
  },
  isPublic: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  sport: { type: String, required: true },
  position: { type: String },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);