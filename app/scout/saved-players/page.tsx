// app/scout/saved-players/page.tsx

"use client" // Don't forget this for client-side fetching

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import PlayerCard from "@/components/dashboard/scout/PlayerCard"; // Assuming you want to reuse this

import { Player } from "@/lib/types"; // Ensure this type is defined

export default function SavedPlayersPage() {
  const [savedPlayers, setSavedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedPlayers = async () => {
      try {
        const response = await fetch('/api/scout/saved-players'); // Call your new API route
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Player[] = await response.json();
        setSavedPlayers(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch saved players.");
        console.error("Error fetching saved players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPlayers();
  }, []); // Empty dependency array means it runs once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-label="Loading saved players" />
        <p className="ml-2 text-lg text-gray-600">Loading saved players...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Players</h1>
        <Button asChild>
          <Link href="/scout/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Favorite Players
          </CardTitle>
          <CardDescription>Manage players you've marked for future reference.</CardDescription>
        </CardHeader>
        <CardContent>
          {savedPlayers.length > 0 ? (
            <div className="space-y-4">
              {savedPlayers.map((player, index) => (
                <PlayerCard key={player.id} player={player} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="mb-4">No players saved yet.</p>
              <p>Start exploring players on your dashboard and click the save icon to add them here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
