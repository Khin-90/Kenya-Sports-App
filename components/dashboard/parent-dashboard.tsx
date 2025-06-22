"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Users,
  Eye,
  MessageSquare,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
} from "lucide-react"
import Link from "next/link"

export function ParentDashboard() {
  const [childData] = useState({
    name: "Sarah Kamau",
    sport: "Basketball",
    position: "Point Guard",
    age: 16,
    aiScore: 89.2,
    profileViews: 45,
    scoutRequests: 3,
    privacySettings: {
      profileVisible: true,
      allowScoutContact: true,
      showPersonalInfo: false,
      allowVideoAnalysis: true,
    },
  })

  const scoutRequests = [
    {
      id: 1,
      scoutName: "James Mwangi",
      organization: "Nairobi Basketball Academy",
      message: "Interested in inviting Sarah for academy trials",
      status: "pending",
      requestedAt: "2 hours ago",
      verified: true,
    },
    {
      id: 2,
      scoutName: "Mary Njeri",
      organization: "Kenya Basketball Federation",
      message: "Would like to discuss national team opportunities",
      status: "pending",
      requestedAt: "1 day ago",
      verified: true,
    },
    {
      id: 3,
      scoutName: "Peter Ouma",
      organization: "University of Nairobi",
      message: "Scholarship opportunity discussion",
      status: "approved",
      requestedAt: "3 days ago",
      verified: true,
    },
  ]

  const recentActivity = [
    {
      type: "profile_view",
      description: "Profile viewed by verified scout",
      time: "1 hour ago",
      severity: "info",
    },
    {
      type: "video_analysis",
      description: "New AI analysis completed",
      time: "2 hours ago",
      severity: "success",
    },
    {
      type: "scout_request",
      description: "New scout contact request",
      time: "2 hours ago",
      severity: "warning",
    },
  ]

  const handleScoutRequest = (requestId: number, action: "approve" | "reject") => {
    console.log(`${action} request ${requestId}`)
    // Handle the request approval/rejection
  }

  const handlePrivacyChange = (setting: string, value: boolean) => {
    console.log(`Privacy setting ${setting} changed to ${value}`)
    // Update privacy settings
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Parent Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage and protect {childData.name}'s sports journey</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/parent/child-profile">
              <Eye className="h-4 w-4 mr-2" />
              View Child's Profile
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/parent/settings">
              <Settings className="h-4 w-4 mr-2" />
              Privacy Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert for pending requests */}
      {scoutRequests.filter((req) => req.status === "pending").length > 0 && (
        <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            You have {scoutRequests.filter((req) => req.status === "pending").length} pending scout requests that need
            your approval.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Child Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {childData.name}'s Overview
              </CardTitle>
              <CardDescription>Current performance and activity summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={childData.name} />
                  <AvatarFallback>
                    {childData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{childData.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {childData.sport} - {childData.position} • Age {childData.age}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-green-100 text-green-800">AI Score: {childData.aiScore}</Badge>
                    <span className="text-sm text-gray-500">{childData.profileViews} profile views</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{childData.profileViews}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Profile Views</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{childData.scoutRequests}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Scout Requests</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{childData.aiScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Performance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scout Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Scout Contact Requests
              </CardTitle>
              <CardDescription>Review and approve scout contact requests for {childData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoutRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {request.scoutName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {request.scoutName}
                            {request.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{request.organization}</p>
                          <p className="text-xs text-gray-500">{request.requestedAt}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {request.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {request.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {request.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{request.message}</p>

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleScoutRequest(request.id, "approve")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleScoutRequest(request.id, "reject")}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Privacy Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Controls
              </CardTitle>
              <CardDescription>Manage {childData.name}'s privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Profile Visible</p>
                  <p className="text-xs text-gray-500">Allow scouts to find profile</p>
                </div>
                <Switch
                  checked={childData.privacySettings.profileVisible}
                  onCheckedChange={(value) => handlePrivacyChange("profileVisible", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Scout Contact</p>
                  <p className="text-xs text-gray-500">Allow scout contact requests</p>
                </div>
                <Switch
                  checked={childData.privacySettings.allowScoutContact}
                  onCheckedChange={(value) => handlePrivacyChange("allowScoutContact", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Personal Info</p>
                  <p className="text-xs text-gray-500">Show contact details</p>
                </div>
                <Switch
                  checked={childData.privacySettings.showPersonalInfo}
                  onCheckedChange={(value) => handlePrivacyChange("showPersonalInfo", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Video Analysis</p>
                  <p className="text-xs text-gray-500">Allow AI video analysis</p>
                </div>
                <Switch
                  checked={childData.privacySettings.allowVideoAnalysis}
                  onCheckedChange={(value) => handlePrivacyChange("allowVideoAnalysis", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div
                      className={`p-1 rounded-full ${
                        activity.severity === "success"
                          ? "bg-green-100"
                          : activity.severity === "warning"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {activity.severity === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {activity.severity === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {activity.severity === "info" && <Eye className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
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
                <Link href="/parent/activity-log">
                  <Activity className="h-4 w-4 mr-2" />
                  View Activity Log
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/parent/scout-history">
                  <Users className="h-4 w-4 mr-2" />
                  Scout Interaction History
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/parent/reports">
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
