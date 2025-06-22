"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/use-toast";

export default function UploadVideoPage() {
  const webcamRef = useRef<Webcam>(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sport, setSport] = useState("football");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState(17);
  const { toast } = useToast();

  const { data: session } = useSession();
  const playerName = session?.user?.name || "Player";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video file first",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to upload videos",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setIsAnalyzing(true);

    try {
      // 1. Upload the video
      const uploadFormData = new FormData();
      uploadFormData.append("video", videoFile);
      uploadFormData.append("title", `${sport} performance - ${new Date().toLocaleDateString()}`);

      const uploadResponse = await fetch("/api/upload-video", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${await uploadResponse.text()}`);
      }

      const { url, videoId } = await uploadResponse.json();

      // 2. Analyze the video
      const analysisResponse = await fetch("/api/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: url,
          videoId,
          sport,
          position,
          age
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${await analysisResponse.text()}`);
      }

      const analysisData = await analysisResponse.json();
      setAnalysisResult(analysisData);

      toast({
        title: "Success!",
        description: "Your video has been analyzed successfully",
      });

    } catch (error: any) {
      console.error("Upload/Analysis error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during upload/analysis",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Upload or Record Your Performance</h1>
          <p className="text-muted-foreground text-lg">
            Let our AI analyze your skills in real time or from a recorded video.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Video Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-green-600" /> Upload Video
              </CardTitle>
              <CardDescription>
                Upload your performance video for detailed AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Sport</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm bg-background"
                    disabled={uploading}
                  >
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="athletics">Athletics</option>
                    <option value="boxing">Boxing</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="rugby">Rugby</option>
                    <option value="tennis">Tennis</option>
                    <option value="swimming">Swimming</option>
                    <option value="martial arts">Martial Arts</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <Input
                    placeholder="Your position (e.g., Striker, Point Guard)"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    disabled={uploading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={5}
                    max={50}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Video File</label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: MP4, MOV, AVI (max 100MB)
                </p>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleUpload}
                disabled={uploading || !videoFile}
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">
                      <UploadCloud className="w-4 h-4" />
                    </span>
                    {isAnalyzing ? "Analyzing..." : "Uploading..."}
                  </span>
                ) : (
                  "Upload and Analyze"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Live Camera Card */}
          <Card>
            <CardHeader>
              <CardTitle>Live Analysis Session</CardTitle>
              <CardDescription>
                Get real-time feedback during your training
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="w-full h-full object-cover"
                  screenshotFormat="image/jpeg"
                />
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => toast({
                  title: "Feature Coming Soon",
                  description: "Live analysis will be available in our next update!",
                })}
              >
                Start Live Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-green-700">
                {playerName}'s {sport} Performance Analysis
              </CardTitle>
              <CardDescription className="text-base">
                {analysisResult.detailedAnalysis || "Your comprehensive performance breakdown"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm font-medium">Overall Score</p>
                  <p className="text-2xl font-bold mt-1">
                    {analysisResult.overallScore || "N/A"}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm font-medium">Technical</p>
                  <p className="text-2xl font-bold mt-1">
                    {analysisResult.technicalSkills || "N/A"}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm font-medium">Physical</p>
                  <p className="text-2xl font-bold mt-1">
                    {analysisResult.physicalAttributes || "N/A"}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm font-medium">Mental</p>
                  <p className="text-2xl font-bold mt-1">
                    {analysisResult.mentalStrength || "N/A"}
                  </p>
                </div>
              </div>

              {analysisResult.recommendations?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Training Recommendations</h3>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button variant="outline" className="mr-2">
                  Save Report
                </Button>
                <Button>
                  View Training Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}