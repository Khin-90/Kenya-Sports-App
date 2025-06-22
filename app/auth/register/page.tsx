"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Shield, Users, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"

type UserRole = "player" | "scout" | "parent"

// Static data for counties and sports (you can move this to API later)
const KENYAN_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
]

const SPORTS_DATA = {
  football: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Striker", "Winger"],
  basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  rugby: ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Scrum Half", "Fly Half", "Centre", "Wing", "Fullback"],
  athletics: ["Sprinter", "Middle Distance", "Long Distance", "Jumper", "Thrower"],
  volleyball: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite Hitter", "Libero"],
  netball: ["Goal Shooter", "Goal Attack", "Wing Attack", "Centre", "Wing Defence", "Goal Defence", "Goal Keeper"],
}

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>("player")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    county: "",
    dateOfBirth: "",
    sport: "",
    position: "",
    bio: "",
    clubName: "",
    licenseNumber: "",
    childEmail: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      setLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      setLoading(false)
      return
    }

    // Role-specific validation
    if (role === "player" && !formData.sport) {
      setError("Please select a sport")
      setLoading(false)
      return
    }

    if (role === "scout" && (!formData.clubName || !formData.licenseNumber)) {
      setError("Club name and license number are required for scouts")
      setLoading(false)
      return
    }

    console.log("Submitting registration:", { email: formData.email, role })

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          ...formData,
        }),
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Registration failed. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedSportPositions = formData.sport ? SPORTS_DATA[formData.sport as keyof typeof SPORTS_DATA] || [] : []

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your account has been created successfully. You can now login with your credentials.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/login">Go to Login</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join TalentScout Kenya</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Choose your role and start your journey in merit-based sports scouting
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card
              className={`cursor-pointer transition-all ${role === "player" ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20" : ""}`}
              onClick={() => setRole("player")}
            >
              <CardHeader className="text-center">
                <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <CardTitle className="text-lg">Player</CardTitle>
                <CardDescription>Showcase your talent</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${role === "scout" ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
              onClick={() => setRole("scout")}
            >
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <CardTitle className="text-lg">Scout</CardTitle>
                <CardDescription>Discover talent</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${role === "parent" ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" : ""}`}
              onClick={() => setRole("parent")}
            >
              <CardHeader className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <CardTitle className="text-lg">Parent</CardTitle>
                <CardDescription>Protect your child</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {role === "player" && <User className="h-5 w-5 text-green-600" />}
                {role === "scout" && <Shield className="h-5 w-5 text-blue-600" />}
                {role === "parent" && <Users className="h-5 w-5 text-purple-600" />}
                Register as {role.charAt(0).toUpperCase() + role.slice(1)}
              </CardTitle>
              <CardDescription>
                {role === "player" && "Create your player profile and start getting noticed by scouts"}
                {role === "scout" && "Join our verified scout network and discover talent"}
                {role === "parent" && "Manage and protect your child's sports journey"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Select
                      value={formData.county}
                      onValueChange={(value) => handleInputChange("county", value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your county" />
                      </SelectTrigger>
                      <SelectContent>
                        {KENYAN_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county.toLowerCase()}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Role-specific fields */}
                {role === "player" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sport">Primary Sport</Label>
                        <Select
                          value={formData.sport}
                          onValueChange={(value) => handleInputChange("sport", value)}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your sport" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(SPORTS_DATA).map((sport) => (
                              <SelectItem key={sport} value={sport}>
                                {sport.charAt(0).toUpperCase() + sport.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Select
                          value={formData.position}
                          onValueChange={(value) => handleInputChange("position", value)}
                          disabled={!selectedSportPositions.length || loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedSportPositions.map((position) => (
                              <SelectItem key={position} value={position.toLowerCase()}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio (Optional)</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your sports journey..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={3}
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                {role === "scout" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clubName">Club/Organization</Label>
                      <Input
                        id="clubName"
                        placeholder="e.g., AFC Leopards"
                        value={formData.clubName}
                        onChange={(e) => handleInputChange("clubName", e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="Official scouting license"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {role === "parent" && (
                  <div>
                    <Label htmlFor="childEmail">Child's Email (Optional)</Label>
                    <Input
                      id="childEmail"
                      type="email"
                      placeholder="child@example.com"
                      value={formData.childEmail}
                      onChange={(e) => handleInputChange("childEmail", e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave empty if your child doesn't have an account yet</p>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    required
                    disabled={loading}
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-green-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-green-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-green-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
