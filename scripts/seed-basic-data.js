// Basic data seeding script for TalentScout Kenya
const { MongoClient, ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = "talentscout_kenya"

// Sample data to insert
const SAMPLE_DATA = {
  counties: [
    { name: "Nairobi", region: "Nairobi", population: 4397073 },
    { name: "Mombasa", region: "Coast", population: 1208333 },
    { name: "Kisumu", region: "Nyanza", population: 1155574 },
    { name: "Nakuru", region: "Rift Valley", population: 2162202 },
    { name: "Eldoret", region: "Rift Valley", population: 1163186 },
  ],

  sports: [
    {
      name: "Football",
      category: "Team Sport",
      popularity: "Very High",
      positions: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Striker"],
      governing_body: "Football Kenya Federation (FKF)",
    },
    {
      name: "Basketball",
      category: "Team Sport",
      popularity: "Medium",
      positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
      governing_body: "Kenya Basketball Federation",
    },
    {
      name: "Rugby",
      category: "Team Sport",
      popularity: "High",
      positions: ["Prop", "Hooker", "Lock", "Flanker", "Scrum Half", "Fly Half"],
      governing_body: "Kenya Rugby Union",
    },
  ],

  users: [
    {
      email: "demo@player.com",
      firstName: "John",
      lastName: "Kamau",
      phone: "+254701234567",
      county: "nairobi",
      dateOfBirth: new Date("2007-03-15"),
      role: "player",
      sport: "football",
      position: "midfielder",
      bio: "Passionate midfielder with excellent ball control.",
      aiScore: 87.5,
      isVerified: true,
      isActive: true,
    },
    {
      email: "demo@scout.com",
      firstName: "James",
      lastName: "Mwangi",
      phone: "+254710123456",
      county: "nairobi",
      dateOfBirth: new Date("1985-04-20"),
      role: "scout",
      clubName: "AFC Leopards",
      licenseNumber: "KFF-2024-001",
      organizationType: "professional_club",
      isVerified: true,
      isActive: true,
    },
    {
      email: "demo@parent.com",
      firstName: "Samuel",
      lastName: "Kamau",
      phone: "+254720123456",
      county: "nairobi",
      dateOfBirth: new Date("1975-06-25"),
      role: "parent",
      childrenIds: [],
      isVerified: true,
      isActive: true,
    },
  ],
}

async function seedBasicData() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is required")
    console.log("Please set your MongoDB connection string in .env.local")
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()

    const db = client.db(DB_NAME)
    console.log(`✅ Connected to database: ${DB_NAME}`)

    // Hash password for demo users
    const hashedPassword = await bcrypt.hash("password", 12)
    console.log("🔐 Password hashed for demo users")

    // Insert counties
    console.log("🏞️ Inserting counties...")
    await db.collection("counties").deleteMany({}) // Clear existing
    const countiesResult = await db.collection("counties").insertMany(
      SAMPLE_DATA.counties.map((county) => ({
        ...county,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )
    console.log(`✅ Inserted ${countiesResult.insertedCount} counties`)

    // Insert sports
    console.log("⚽ Inserting sports...")
    await db.collection("sports").deleteMany({}) // Clear existing
    const sportsResult = await db.collection("sports").insertMany(
      SAMPLE_DATA.sports.map((sport) => ({
        ...sport,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )
    console.log(`✅ Inserted ${sportsResult.insertedCount} sports`)

    // Insert users
    console.log("👥 Inserting demo users...")
    await db.collection("users").deleteMany({}) // Clear existing
    await db.collection("players").deleteMany({})
    await db.collection("scouts").deleteMany({})
    await db.collection("parents").deleteMany({})

    for (const userData of SAMPLE_DATA.users) {
      const userId = new ObjectId()
      const user = {
        _id: userId,
        ...userData,
        passwordHash: hashedPassword,
        privacySettings:
          userData.role === "player"
            ? {
                profileVisible: true,
                allowScoutContact: true,
                showPersonalInfo: false,
                allowVideoAnalysis: true,
              }
            : undefined,
        notificationPreferences:
          userData.role === "parent"
            ? {
                email: true,
                sms: true,
                push: true,
              }
            : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Insert into users collection
      await db.collection("users").insertOne(user)

      // Insert into role-specific collection
      if (userData.role === "player") {
        await db.collection("players").insertOne(user)
      } else if (userData.role === "scout") {
        await db.collection("scouts").insertOne(user)
      } else if (userData.role === "parent") {
        await db.collection("parents").insertOne(user)
      }
    }

    console.log(`✅ Inserted ${SAMPLE_DATA.users.length} demo users`)

    // Create basic indexes
    console.log("📊 Creating indexes...")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("players").createIndex({ email: 1 }, { unique: true })
    await db.collection("players").createIndex({ aiScore: -1 })
    await db.collection("scouts").createIndex({ email: 1 }, { unique: true })
    await db.collection("parents").createIndex({ email: 1 }, { unique: true })
    console.log("✅ Basic indexes created")

    console.log("\n🎉 Basic data seeding completed!")
    console.log("\n📋 Demo Login Credentials:")
    console.log("Player: demo@player.com / password")
    console.log("Scout: demo@scout.com / password")
    console.log("Parent: demo@parent.com / password")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
  } finally {
    await client.close()
    console.log("🔌 Connection closed")
  }
}

// Run the seeding
seedBasicData()
