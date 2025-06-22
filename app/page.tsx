import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Shield, Zap, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🇰🇪 Made for Kenya
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Merit-Based Sports Scouting for <span className="text-green-600">Kenya</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Eliminating corruption and nepotism in sports through AI-powered talent evaluation. Every player deserves a
            fair chance to shine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/auth/register">Start Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Revolutionizing Sports Scouting</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform uses cutting-edge AI to ensure every talented player gets noticed, regardless of their
            background or connections.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <Zap className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Google Gemini AI analyzes player videos and stats to provide objective performance reports
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Child Protection</CardTitle>
              <CardDescription>
                All interactions with players under 18 are managed through verified parent dashboards
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <Users className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Verified Scouts</CardTitle>
              <CardDescription>
                All scouts must provide verified documentation including club licenses and ID verification
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <MapPin className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Regional Focus</CardTitle>
              <CardDescription>
                Discover talent from all regions of Kenya, especially underserved and rural areas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <Trophy className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Public Leaderboards</CardTitle>
              <CardDescription>
                Transparent rankings based on AI performance scores by region and age group
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <Star className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>Opportunity Matching</CardTitle>
              <CardDescription>
                AI connects players to relevant tryouts, academies, and development programs
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-green-100">Players Registered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Verified Scouts</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">47</div>
              <div className="text-green-100">Counties Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-green-100">Merit-Based</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Change Kenyan Sports?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of players, scouts, and parents who are building a fairer future for Kenyan sports.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/auth/register">Get Started Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
