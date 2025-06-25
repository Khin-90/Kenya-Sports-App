// app/scout/analytics/page.tsx
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart2, TrendingUp, Loader2 } from "lucide-react";

// Define the interface for analytics data, matching your API response
interface AnalyticsData {
  totalPlayersViewed: number;
  totalContactRequests: number;
  approvedContactRequests: number;
  pendingContactRequests: number;
  contactSuccessRate: number;
  totalSavedPlayers: number;
}

export default function ScoutingAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/scout/analytics');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: AnalyticsData = await response.json();
        setAnalyticsData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch analytics data.");
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-label="Loading analytics" />
        <p className="ml-2 text-lg text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <p className="text-xl mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p className="text-xl mb-4">No analytics data available.</p>
        <Button asChild><Link href="/scout/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scouting Analytics</h1>
        <Button asChild>
          <Link href="/scout/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Your Scouting Performance
          </CardTitle>
          <CardDescription>Gain insights into your scouting activities and player engagement.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Players Viewed</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold text-blue-600">{analyticsData.totalPlayersViewed}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Contact Requests Sent</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold text-purple-600">{analyticsData.totalContactRequests}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Approved Contacts</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold text-green-600">{analyticsData.approvedContactRequests}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Pending Contacts</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold text-yellow-600">{analyticsData.pendingContactRequests}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Contact Success Rate</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold text-teal-600">{analyticsData.contactSuccessRate}%</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Players Saved</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold text-orange-600">{analyticsData.totalSavedPlayers}</p></CardContent>
            </Card>
          </div>
          <div className="text-center text-gray-500 py-10">
            <p className="mb-4">More detailed charts and graphs can be integrated here using charting libraries (e.g., Recharts, Chart.js).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
