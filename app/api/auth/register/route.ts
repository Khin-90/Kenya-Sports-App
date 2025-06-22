import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

// MongoDB connection
async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  return client.db("talentscout_kenya")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Registration attempt:", { email: body.email, role: body.role })

    const {
      role,
      email,
      password,
      firstName,
      lastName,
      phone,
      county,
      dateOfBirth,
      // Player specific
      sport,
      position,
      bio,
      // Scout specific
      clubName,
      licenseNumber,
      // Parent specific
      childEmail,
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !county || !dateOfBirth || !role) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Connect to database
    const db = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)
    console.log("Password hashed successfully")

    // Create user ID
    const userId = new ObjectId()

    // Create base user data
    const baseUserData = {
      _id: userId,
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      phone,
      county: county.toLowerCase(),
      dateOfBirth: new Date(dateOfBirth),
      role: role as "player" | "scout" | "parent",
      isVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    let userData

    // Create role-specific user data
    switch (role) {
      case "player":
        if (!sport) {
          return NextResponse.json({ error: "Sport is required for players" }, { status: 400 })
        }

        userData = {
          ...baseUserData,
          sport: sport.toLowerCase(),
          position: position?.toLowerCase() || "",
          bio: bio || "",
          aiScore: 0,
          height: null,
          weight: null,
          parentId: null,
          privacySettings: {
            profileVisible: true,
            allowScoutContact: true,
            showPersonalInfo: false,
            allowVideoAnalysis: true,
          },
          stats: {
            matches: 0,
            goals: 0,
            assists: 0,
            points: 0,
            personalBest: "",
            medals: 0,
          },
        }
        break

      case "scout":
        if (!clubName || !licenseNumber) {
          return NextResponse.json({ error: "Club name and license number are required for scouts" }, { status: 400 })
        }

        userData = {
          ...baseUserData,
          clubName,
          licenseNumber,
          organizationType: "club",
          specialization: "",
          isVerified: false,
          verificationDocuments: [],
          verificationStatus: "pending",
          verifiedAt: null,
        }
        break

      case "parent":
        userData = {
          ...baseUserData,
          childrenIds: [],
          notificationPreferences: {
            email: true,
            sms: true,
            push: true,
          },
        }
        break

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Insert into users collection
    await db.collection("users").insertOne(userData)
    console.log("User inserted into users collection")

    // Insert into role-specific collection
    if (role === "player") {
      await db.collection("players").insertOne(userData)
      console.log("User inserted into players collection")
    } else if (role === "scout") {
      await db.collection("scouts").insertOne(userData)
      console.log("User inserted into scouts collection")
    } else if (role === "parent") {
      await db.collection("parents").insertOne(userData)
      console.log("User inserted into parents collection")
    }

    console.log("Registration successful for:", email)

    // Remove sensitive data from response
    const { passwordHash: removedPasswordHash, ...userResponse } = userData

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: userResponse._id.toString(),
        email: userResponse.email,
        name: `${userResponse.firstName} ${userResponse.lastName}`,
        role: userResponse.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
