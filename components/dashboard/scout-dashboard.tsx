"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Eye, MessageSquare, Star, MapPin, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"

export function ScoutDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState("all")
  const [selectedSport, setSelectedSport] = useState("all")
  const [scoutStats, setScoutStats] = useState<any[]>([])
  const [topPlayers, setTopPlayers] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, playersRes, activityRes] = await Promise.all([
          fetch("/api/scout/stats"),
          fetch("/api/scout/recommendations"),
          fetch("/api/scout/activity"),
        ])

        const statsData = await statsRes.json()
        const playersData = await playersRes.json()
        const activityData = await activityRes.json()

        // Defensive check: Ensure statsData is an array
        if (Array.isArray(statsData)) {
          setScoutStats(statsData)
        } else {
          console.error("API /api/scout/stats did not return an array:", statsData);
          setScoutStats([]); // Fallback to an empty array
        }
        
        // Defensive check: Ensure playersData is an array before setting state
        if (Array.isArray(playersData)) {
          setTopPlayers(playersData)
        } else {
          console.error("API /api/scout/recommendations did not return an array:", playersData);
          setTopPlayers([]); // Fallback to an empty array
        }
        
        // Defensive check: Ensure activityData is an array before setting state
        if (Array.isArray(activityData)) {
          setRecentActivity(activityData)
        } else {
          console.error("API /api/scout/activity did not return an array:", activityData);
          setRecentActivity([]); // Fallback to an empty array
        }

      } catch (err) {
        console.error("Error fetching scout dashboard data:", err)
        // Ensure all states are reset to empty arrays on fetch error
        setScoutStats([]);
        setTopPlayers([]);
        setRecentActivity([]);
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Scout Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover and connect with talented players across Kenya</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/scout/search">
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/scout/profile">My Profile</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {scoutStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              {/* Assuming 'change' property exists and is a string/number */}
              {stat.change && <p className="text-xs text-green-600 mt-2">{stat.change} this month</p>}
            </CardContent>
          </Card>
        ))}
      </div>

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
                  />
                </div>
                <div>
                  <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                    <SelectTrigger>
                      <SelectValue placeholder="County" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Counties</SelectItem>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="rugby">Rugby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-4">Search Players</Button>
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
                {topPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                        <AvatarFallback>
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{player.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {player.sport} - {player.position}
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
                        <div className="text-lg font-bold text-green-600">{player.aiScore}</div>
                        <div className="text-xs text-gray-500">AI Score</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/scout/recommendations">View All Recommendations</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {activity.type === "contact_request" && "Contact request sent"}
                        {activity.type === "profile_view" && "Profile viewed"}
                        {activity.type === "contact_approved" && "Contact approved"}
                      </p>
                      <p className="text-xs text-gray-500">{activity.player}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === "approved" ? "default" : "secondary"} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/scout/saved-players">
                  <Star className="h-4 w-4 mr-2" />
                  Saved Players
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/scout/contact-history">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact History
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/scout/analytics">
                  <Trophy className="h-4 w-4 mr-2" />
                  Scouting Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Club License</span>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identity Document</span>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background Check</span>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
