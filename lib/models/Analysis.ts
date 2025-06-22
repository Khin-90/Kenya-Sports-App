// lib/models/Analysis.ts
import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  result: { 
    overallScore: Number,
    technicalSkills: Number,
    physicalAttributes: Number,
    tacticalAwareness: Number,
    mentalStrength: Number,
    strengths: [String],
    areasForImprovement: [String],
    recommendations: [String],
    detailedAnalysis: String,
    analysisVersion: { type: String, default: "v1" }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);