// components/dashboard/scout-dashboard.tsx

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Import types
import { Player, ScoutStat, Activity } from "@/lib/types";

// Import constants
import { KENYAN_COUNTIES, SPORTS_LIST } from "@/lib/constants";

// Import custom hook
import { useDebounce } from "@/lib/hooks/useDebounce";

// Import extracted components
import PlayerCard from "./scout/PlayerCard";
import ScoutStatsGrid from "./scout/ScoutStatsGrid";
import RecentActivityFeed from "./scout/RecentActivityFeed";
import QuickActions from "./scout/QuickActions";
import VerificationStatus from "./scout/VerificationStatus";

export function ScoutDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500); // Debounce search term by 500ms

  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [selectedSport, setSelectedSport] = useState<string>("all");

  const [scoutStats, setScoutStats] = useState<ScoutStat[]>([]);
  const [allRecommendedPlayers, setAllRecommendedPlayers] = useState<Player[]>([]); // All players fetched from API
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null); // State for API errors
  const [isSearching, setIsSearching] = useState<boolean>(false); // State for search button loading

  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null); // Clear previous errors
    try {
      const [statsRes, playersRes, activityRes] = await Promise.all([
        fetch("/api/scout/stats"),
        fetch("/api/scout/recommendations"),
        fetch("/api/scout/activity"),
      ]);

      if (!statsRes.ok) throw new Error(`Failed to fetch stats: ${statsRes.statusText}`);
      if (!playersRes.ok) throw new Error(`Failed to fetch players: ${playersRes.statusText}`);
      if (!activityRes.ok) throw new Error(`Failed to fetch activity: ${activityRes.statusText}`);

      const statsData: ScoutStat[] = await statsRes.json();
      const playersData: Player[] = await playersRes.json();
      const activityData: Activity[] = await activityRes.json();

      if (Array.isArray(statsData)) {
        setScoutStats(statsData);
      } else {
        console.error("API /api/scout/stats did not return an array:", statsData);
        setScoutStats([]);
      }
      
      if (Array.isArray(playersData)) {
        setAllRecommendedPlayers(playersData);
      } else {
        console.error("API /api/scout/recommendations did not return an array:", playersData);
        setAllRecommendedPlayers([]);
      }
      
      if (Array.isArray(activityData)) {
        setRecentActivity(activityData);
      } else {
        console.error("API /api/scout/activity did not return an array:", activityData);
        setRecentActivity([]);
      }

    } catch (err: any) {
      console.error("Error fetching scout dashboard data:", err);
      setApiError(err.message || "An unexpected error occurred while fetching data.");
      setScoutStats([]);
      setAllRecommendedPlayers([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize filtered players to prevent unnecessary re-renders
  const filteredPlayers = useMemo(() => {
    setIsSearching(true); // Indicate search is active
    let currentFilteredPlayers = [...allRecommendedPlayers];

    if (debouncedSearchTerm) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
      currentFilteredPlayers = currentFilteredPlayers.filter(player =>
        player.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (selectedCounty !== "all") {
      currentFilteredPlayers = currentFilteredPlayers.filter(player =>
        player.county.toLowerCase() === selectedCounty.toLowerCase()
      );
    }

    if (selectedSport !== "all") {
      currentFilteredPlayers = currentFilteredPlayers.filter(player =>
        player.sport.toLowerCase() === selectedSport.toLowerCase()
      );
    }
    setIsSearching(false); // Indicate search is complete
    return currentFilteredPlayers;
  }, [allRecommendedPlayers, debouncedSearchTerm, selectedCounty, selectedSport]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-label="Loading dashboard" />
        <p className="ml-2 text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <p className="text-xl mb-4">Error: {apiError}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Scout Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover and connect with talented players across Kenya</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild aria-label="Go to advanced search">
            <Link href="/scout/search">
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Link>
          </Button>
          <Button variant="outline" asChild aria-label="Go to my profile">
            <Link href="/scout/profile">My Profile</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <ScoutStatsGrid stats={scoutStats} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Quick Player Search
              </CardTitle>
              <CardDescription>Find players by name, location, or sport</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Search players..."
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
                      {KENYAN_COUNTIES.map(county => (
                        <SelectItem key={county} value={county}>{county === "all" ? "All Counties" : county.charAt(0).toUpperCase() + county.slice(1)}</SelectItem>
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
                      {SPORTS_LIST.map(sport => (
                        <SelectItem key={sport} value={sport}>{sport === "all" ? "All Sports" : sport.charAt(0).toUpperCase() + sport.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => { /* Filters are applied via useEffect on debouncedSearchTerm, this button can trigger an immediate re-filter if needed, or just serve as visual cue */ }}
                disabled={isSearching}
                aria-label="Apply search filters"
              >
                {isSearching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {isSearching ? "Searching..." : "Search Players"}
              </Button>
            </CardContent>
          </Card>

          {/* Top Recommended Players */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recommended Players
              </CardTitle>
              <CardDescription>AI-matched players based on your scouting preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player, index) => (
                      <PlayerCard key={player.id} player={player} index={index} />
                    ))
                  ) : (
                    <motion.p
                      key="no-players"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-gray-500 py-4"
                    >
                      {allRecommendedPlayers.length === 0 && !loading && !apiError
                        ? "No recommendations available at this time."
                        : "No players found matching your criteria."}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild aria-label="View all recommendations">
                <Link href="/scout/recommendations">View All Recommendations</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RecentActivityFeed activities={recentActivity} />
          <QuickActions />
          <VerificationStatus />
        </div>
      </div>
    </div>
  );
}
