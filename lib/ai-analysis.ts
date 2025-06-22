import { GoogleGenerativeAI } from "@google/generative-ai";

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzePlayerVideo(
  videoUrl: string,
  sport: string,
  position: string,
  playerAge: number,
): Promise<VideoAnalysisResult> {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
        topP: 1,
        topK: 32,
        maxOutputTokens: 4096,
      },
    });

    // Fetch video data
    const videoData = await fetch(videoUrl).then(res => res.arrayBuffer());
    
    // Convert to Base64
    const videoBase64 = Buffer.from(videoData).toString('base64');

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

    // Create the parts array with correct structure
    const parts = [
      { text: prompt },
      {
        inlineData: {
          data: videoBase64,
          mimeType: getMimeType(videoUrl),
        }
      }
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    const response = await result.response;
    const text = response.text();

    // Clean and parse the response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanedText) as VideoAnalysisResult;

    return analysis;
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw new Error(`Failed to analyze video: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper function to determine MIME type
function getMimeType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'avi': return 'video/x-msvideo';
    case 'webm': return 'video/webm';
    default: return 'video/mp4';
  }
}