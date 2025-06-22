import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Zap, Globe, Star } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            About Us
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Who We Are</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            TalentScout Kenya is a digital scouting platform designed to revolutionize how young athletes are discovered.
            We’re eliminating corruption and favoritism in sports by using objective AI-based evaluations and
            transparent public leaderboards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <Zap className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>AI-Driven Talent Evaluation</CardTitle>
              <CardDescription>
                We use advanced AI models to assess player videos, offering unbiased performance insights to scouts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Safe Environment</CardTitle>
              <CardDescription>
                All underage players are connected to a verified parent account for safe communication and access control.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <Users className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Verified Scout Community</CardTitle>
              <CardDescription>
                All scouts on the platform are verified through official club documentation and identity checks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <Star className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>Fair Opportunities</CardTitle>
              <CardDescription>
                Players are ranked based on performance only. No bribes. No favoritism. Just raw, visible talent.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-cyan-200 dark:border-cyan-800">
            <CardHeader>
              <Globe className="h-10 w-10 text-cyan-600 mb-2" />
              <CardTitle>Pan-Kenyan Vision</CardTitle>
              <CardDescription>
                We serve all 47 counties in Kenya with a focus on rural and underserved communities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            We believe every young athlete deserves a fair chance to be seen. Our mission is to use technology to break
            barriers in scouting, especially for talented individuals in areas where traditional scouting systems have
            failed.
          </p>
          <h3 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">No favors. No fees. Just fair scouting.</h3>
        </div>
      </section>

      <Footer />
    </div>
  )
}
