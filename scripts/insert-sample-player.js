// Insert a single sample player for testing
const { MongoClient, ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI

async function insertSamplePlayer() {
  if (!MONGODB_URI) {
    console.error("❌ Please set MONGODB_URI in your .env.local file")
    return
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("talentscout_kenya")

    const hashedPassword = await bcrypt.hash("password", 12)
    const playerId = new ObjectId()

    const player = {
      _id: playerId,
      email: "test@player.com",
      passwordHash: hashedPassword,
      firstName: "Test",
      lastName: "Player",
      phone: "+254700000000",
      county: "nairobi",
      dateOfBirth: new Date("2006-01-01"),
      role: "player",
      sport: "football",
      position: "midfielder",
      bio: "Test player for development",
      aiScore: 75.0,
      height: 175,
      weight: 70,
      privacySettings: {
        profileVisible: true,
        allowScoutContact: true,
        showPersonalInfo: false,
        allowVideoAnalysis: true,
      },
      stats: {
        matches: 10,
        goals: 5,
        assists: 8,
        points: 0,
        personalBest: "",
        medals: 1,
      },
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert into both collections
    await db.collection("users").insertOne(player)
    await db.collection("players").insertOne(player)

    console.log("✅ Sample player inserted successfully!")
    console.log("Login: test@player.com / password")
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await client.close()
  }
}

insertSamplePlayer()
