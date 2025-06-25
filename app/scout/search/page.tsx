// app/scout/search/page.tsx

"use client"

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Player } from "@/lib/types"; // Ensure this type matches your API response
import { KENYAN_COUNTIES, SPORTS_LIST } from "@/lib/constants";

import PlayerCard from "@/components/dashboard/scout/PlayerCard";

export default function AdvancedSearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    setLoading(true);
    setApiError(null);
    setSearchResults([]); // Clear previous results

    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('name', searchTerm);
      if (selectedCounty !== 'all') queryParams.append('county', selectedCounty);
      if (selectedSport !== 'all') queryParams.append('sport', selectedSport);

      // Make the API call to your backend
      const response = await fetch(`/api/players/search?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: Player[] = await response.json();
      setSearchResults(data);

    } catch (err: any) {
      console.error("Error fetching players:", err);
      setApiError(err.message || "An unexpected error occurred while fetching players.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: Trigger search on initial load or when filters change automatically
  // If you want the search to run automatically when filters change, uncomment this:
  /*
  useEffect(() => {
    // Only run search if there's at least one filter applied or on initial load
    if (searchTerm || selectedCounty !== 'all' || selectedSport !== 'all') {
      fetchPlayers();
    }
  }, [searchTerm, selectedCounty, selectedSport]);
  */

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Player Search</h1>
        <Button asChild>
          <Link href="/scout/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Any Player
          </CardTitle>
          <CardDescription>Search the entire player database by name, county, or sport.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search players by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search by player name"
              />
            </div>
            <div>
              <Select value={selectedCounty} onValueChange={setSelectedCounty} aria-label="Filter by county">
                <SelectTrigger>
                  <SelectValue placeholder="County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  {KENYAN_COUNTIES.filter(c => c !== "all").map(county => (
                    <SelectItem key={county} value={county}>{county.charAt(0).toUpperCase() + county.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedSport} onValueChange={setSelectedSport} aria-label="Filter by sport">
                <SelectTrigger>
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {SPORTS_LIST.filter(s => s !== "all").map(sport => (
                    <SelectItem key={sport} value={sport}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            onClick={fetchPlayers} // This button explicitly triggers the search
            disabled={loading}
            aria-label="Perform advanced search"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {loading ? "Searching..." : "Search Players"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>Players matching your advanced search criteria.</CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <div className="text-red-500 text-center py-4">{apiError}</div>
          )}
          {loading && searchResults.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="ml-2 text-lg text-gray-600">Loading search results...</p>
            </div>
          )}
          {!loading && searchResults.length === 0 && !apiError && (
            <p className="text-center text-gray-500 py-10">
              Enter your search criteria above and click "Search Players" to find results.
            </p>
          )}
          <AnimatePresence mode="wait">
            {searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((player, index) => (
                  <PlayerCard key={player.id} player={player} index={index} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
