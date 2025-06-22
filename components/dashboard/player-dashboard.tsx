"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  Upload,
  TrendingUp,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export function PlayerDashboard() {
  const [player, setPlayer] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerRes, analysisRes] = await Promise.all([
          fetch("/api/player"),
          fetch("/api/analysis/latest"),
        ])

        const playerData = await playerRes.json()
        const analysisData = await analysisRes.json()

        setPlayer(playerData)
        setAnalysis(analysisData)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (!player) return <p className="text-center mt-10 text-red-500">Player not found.</p>

  const stats = [
    { label: "Goals", value: player.stats?.goals ?? 0, change: "+2" },
    { label: "Assists", value: player.stats?.assists ?? 0, change: "+1" },
    { label: "Matches", value: player.stats?.matches ?? 0, change: "+3" },
    { label: "Points", value: player.stats?.points ?? 0, change: "+5" },
  ]

  const skillScores = analysis
    ? [
        { skill: "Technical Skills", score: analysis.technicalSkills },
        { skill: "Physical Attributes", score: analysis.physicalAttributes },
        { skill: "Tactical Awareness", score: analysis.tacticalAwareness },
        { skill: "Mental Strength", score: analysis.mentalStrength },
      ]
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {player.firstName} {player.lastName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress and connect with scouts
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/player/upload-video">
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/player/profile">Edit Profile</Link>
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Score</p>
                <p className="text-3xl font-bold text-green-600">{analysis?.overallScore ?? 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Position: {player.position}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">County</p>
                <p className="text-3xl font-bold text-blue-600 capitalize">{player.county}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sport</p>
                <p className="text-3xl font-bold text-purple-600 capitalize">{player.sport}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Height</p>
                <p className="text-3xl font-bold text-orange-600">{player.height ?? "N/A"} cm</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Performance Analysis
              </CardTitle>
              <CardDescription>Latest video analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillScores.map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-gray-600">{skill.score}/100</span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Season Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm">{stat.label}</div>
                    <div className="text-xs text-green-600">{stat.change}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
