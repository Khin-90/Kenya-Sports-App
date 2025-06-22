"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (errorType: string | null) => {
    if (!errorType) return errorMessages.Default
    return errorMessages[errorType] || errorMessages.Default
  }

  const getErrorTitle = (errorType: string | null) => {
    switch (errorType) {
      case "Configuration":
        return "Server Configuration Error"
      case "AccessDenied":
        return "Access Denied"
      case "Verification":
        return "Verification Error"
      default:
        return "Authentication Error"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">{getErrorTitle(error)}</CardTitle>
              <CardDescription>Something went wrong during authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>

              {error === "Configuration" && (
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>This usually means:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Missing environment variables</li>
                    <li>Incorrect NextAuth configuration</li>
                    <li>Database connection issues</li>
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need help?{" "}
                  <Link href="/contact" className="text-green-600 hover:underline">
                    Contact Support
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
