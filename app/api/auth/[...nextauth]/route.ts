import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = async (req: any, res: any) => {
  try {
    const nextAuthHandler = NextAuth(authOptions)
    return await nextAuthHandler(req, res)
  } catch (error) {
    console.error("NextAuth configuration error:", error)

    // Fallback handler for configuration errors
    const fallbackHandler = () => {
      return new Response(
        JSON.stringify({
          error: "Configuration Error",
          message: "Authentication service is not properly configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return fallbackHandler()
  }
}

export { handler as GET, handler as POST }
