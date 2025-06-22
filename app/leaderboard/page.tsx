"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, MapPin, Calendar, Search, Filter, Loader2 } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const kenyanCounties = [
  "All Counties",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Malindi",
  "Kitale",
  "Garissa",
  "Kakamega",
  "Machakos",
  "Meru",
  "Nyeri",
  "Kericho",
  "Embu",
  "Migori",
]

const sports = ["All Sports", "Football", "Rugby", "Basketball", "Volleyball", "Athletics", "Swimming"]
const ageGroups = ["All Ages", "Under 16", "16-18", "18-21", "Over 21"]

interface Player {
  _id: string
  firstName: string
  lastName: string
  sport: string
  position?: string
  county: string
  age: number
  aiScore: number
  rank: number
  email?: string
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState("All Counties")
  const [selectedSport, setSelectedSport] = useState("All Sports")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All Ages")

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedCounty, selectedSport, selectedAgeGroup])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (selectedSport !== "All Sports") {
        params.append("sport", selectedSport.toLowerCase())
      }

      if (selectedCounty !== "All Counties") {
        params.append("county", selectedCounty.toLowerCase())
      }

      if (selectedAgeGroup !== "All Ages") {
        const ageGroupMap: Record<string, string> = {
          "Under 16": "under-16",
          "16-18": "16-18",
          "18-21": "18-21",
          "Over 21": "over-21",
        }
        params.append("ageGroup", ageGroupMap[selectedAgeGroup])
      }

      const response = await fetch(`/api/players/leaderboard?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setPlayers(data.players || [])
      } else {
        console.error("Failed to fetch leaderboard:", data.error)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter((player) => {
    if (!searchTerm) return true
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 dark:bg-green-900/20"
    if (score >= 80) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
    if (score >= 70) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Kenya Sports Leaderboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover top talent from across Kenya, ranked by AI-powered performance analysis
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Players
            </CardTitle>
            <CardDescription>Find players by location, sport, age group, or search by name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">County</label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kenyanCounties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sport</label>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Age Group</label>
                <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((age) => (
                      <SelectItem key={age} value={age}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => {
                setSelectedCounty("All Counties")
                setSelectedSport("All Sports")
                setSelectedAgeGroup("All Ages")
                setSearchTerm("")
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading leaderboard...</span>
          </div>
        ) : (
          <>
            {/* Top 3 Spotlight */}
            {filteredPlayers.length >= 3 && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {filteredPlayers.slice(0, 3).map((player, index) => (
                  <Card
                    key={player._id}
                    className={`relative overflow-hidden ${
                      index === 0
                        ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                        : index === 1
                          ? "ring-2 ring-gray-400 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20"
                          : "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
                    }`}
                  >
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">{getRankIcon(player.rank)}</div>
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage
                          src="/placeholder.svg?height=80&width=80"
                          alt={`${player.firstName} ${player.lastName}`}
                        />
                        <AvatarFallback>
                          {player.firstName.charAt(0)}
                          {player.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xl">
                        {player.firstName} {player.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center justify-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {player.county}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2">
                        <Badge variant="secondary">
                          {player.sport} {player.position && `- ${player.position}`}
                        </Badge>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(player.aiScore)}`}
                        >
                          AI Score: {player.aiScore}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          Age {player.age}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Rankings</CardTitle>
                <CardDescription>All players ranked by AI performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPlayers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No players found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPlayers.map((player) => (
                      <div
                        key={player._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12">{getRankIcon(player.rank)}</div>

                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src="/placeholder.svg?height=48&width=48"
                              alt={`${player.firstName} ${player.lastName}`}
                            />
                            <AvatarFallback>
                              {player.firstName.charAt(0)}
                              {player.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h3 className="font-semibold text-lg">
                              {player.firstName} {player.lastName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>
                                {player.sport} {player.position && `- ${player.position}`}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {player.county}
                              </span>
                              <span>•</span>
                              <span>Age {player.age}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(player.aiScore)}`}
                            >
                              {player.aiScore}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">AI Score</div>
                          </div>

                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{filteredPlayers.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Players Found</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Counties Represented</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sports Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Scouts</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
