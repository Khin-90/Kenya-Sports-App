import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Analysis from "@/lib/models/Analysis";
import Video from "@/lib/models/Video";

// Type definitions
export interface VideoAnalysisResult {
  overallScore: number;
  technicalSkills: number;
  physicalAttributes: number;
  tacticalAwareness: number;
  mentalStrength: number;
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
  detailedAnalysis: string;
}

export class AIAnalysis {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async analyzePlayerVideo(
    videoUrl: string,
    sport: string,
    position: string,
    playerAge: number,
    videoId: string
  ): Promise<VideoAnalysisResult> {
    // Validate input parameters
    if (!videoUrl || !sport || !position || !playerAge || !videoId) {
      throw new Error("Missing required parameters");
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new Error("Invalid videoId format");
    }

    try {
      // Initialize the model
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.5,
          topP: 1,
          topK: 32,
          maxOutputTokens: 4096,
        },
      });

      // Update video status to processing
      await Video.findByIdAndUpdate(videoId, {
        uploadStatus: "processing",
        updatedAt: new Date(),
      });

      // Fetch video data
      const videoData = await fetch(videoUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch video: ${res.statusText}`);
          }
          return res.arrayBuffer();
        })
        .catch((error) => {
          throw new Error(`Video fetch error: ${error.message}`);
        });

      // Convert to Base64
      const videoBase64 = Buffer.from(videoData).toString("base64");

      const prompt = `
        Analyze this ${sport} player video for a ${playerAge}-year-old ${position}. 
        Provide objective performance analysis focusing on:
        
        1. Technical Skills (ball control, passing accuracy, shooting technique)
        2. Physical Attributes (speed, agility, strength, endurance)
        3. Tactical Awareness (positioning, decision making, game reading)
        4. Mental Strength (composure, leadership, resilience)
        
        Rate each category from 1-100 and provide an overall score.
        Give specific recommendations for improvement and highlight key strengths.
        Be objective and merit-based in your assessment.
        
        Format your response as JSON with the following structure:
        {
          "overallScore": number,
          "technicalSkills": number,
          "physicalAttributes": number,
          "tacticalAwareness": number,
          "mentalStrength": number,
          "recommendations": ["recommendation1", "recommendation2"],
          "strengths": ["strength1", "strength2"],
          "areasForImprovement": ["area1", "area2"],
          "detailedAnalysis": "detailed analysis text"
        }
        Only respond with the JSON object, no additional text or markdown.
      `;

      const parts = [
        { text: prompt },
        {
          inlineData: {
            data: videoBase64,
            mimeType: this.getMimeType(videoUrl),
          },
        },
      ];

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
      });

      const response = await result.response;
      const text = response.text();

      // Clean and parse the response
      const cleanedText = text.replace(/```json|```/g, "").trim();
      const analysis = JSON.parse(cleanedText) as VideoAnalysisResult;

      // Save analysis to database
      const analysisRecord = new Analysis({
        videoId: new mongoose.Types.ObjectId(videoId),
        result: {
          overallScore: analysis.overallScore,
          technicalSkills: analysis.technicalSkills,
          physicalAttributes: analysis.physicalAttributes,
          tacticalAwareness: analysis.tacticalAwareness,
          mentalStrength: analysis.mentalStrength,
          strengths: analysis.strengths,
          areasForImprovement: analysis.areasForImprovement,
          recommendations: analysis.recommendations,
          detailedAnalysis: analysis.detailedAnalysis,
          analysisVersion: "v1",
        },
        createdAt: new Date(),
      });

      await analysisRecord.save();

      // Update video status to completed
      await Video.findByIdAndUpdate(videoId, {
        uploadStatus: "completed",
        updatedAt: new Date(),
      });

      return analysis;
    } catch (error) {
      console.error("Error analyzing video:", error);

      // Update video status to failed if error occurs
      await Video.findByIdAndUpdate(videoId, {
        uploadStatus: "failed",
        updatedAt: new Date(),
      }).catch((dbError) => {
        console.error("Failed to update video status:", dbError);
      });

      throw new Error(
        `Failed to analyze video: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Helper function to determine MIME type
  private getMimeType(url: string): string {
    const extension = url.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "mp4":
        return "video/mp4";
      case "mov":
        return "video/quicktime";
      case "avi":
        return "video/x-msvideo";
      case "webm":
        return "video/webm";
      default:
        return "video/mp4";
    }
  }
}

// Maintain the existing function export for backward compatibility
export async function analyzePlayerVideo(
  videoUrl: string,
  sport: string,
  position: string,
  playerAge: number,
  videoId: string
): Promise<VideoAnalysisResult> {
  const analyzer = new AIAnalysis();
  return analyzer.analyzePlayerVideo(videoUrl, sport, position, playerAge, videoId);
}