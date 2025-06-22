import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  url: { type: String, required: true },
  sport: { type: String, required: true },
  position: { type: String, required: true },
  age: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);