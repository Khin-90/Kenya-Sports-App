import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  result: { type: Object, required: true }, // This would be your VideoAnalysisResult
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);