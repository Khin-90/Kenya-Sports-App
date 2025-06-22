// Create database indexes for better performance
const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI

async function createIndexes() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is required")
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()

    const db = client.db("talentscout_kenya")
    console.log("✅ Connected to database")

    // Create indexes for users collection
    console.log("📊 Creating indexes for users collection...")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ role: 1 })
    await db.collection("users").createIndex({ county: 1 })
    await db.collection("users").createIndex({ isActive: 1 })

    // Create indexes for players collection
    console.log("📊 Creating indexes for players collection...")
    await db.collection("players").createIndex({ email: 1 }, { unique: true })
    await db.collection("players").createIndex({ sport: 1 })
    await db.collection("players").createIndex({ aiScore: -1 })
    await db.collection("players").createIndex({ county: 1 })
    await db.collection("players").createIndex({ "privacySettings.profileVisible": 1 })

    // Create indexes for scouts collection
    console.log("📊 Creating indexes for scouts collection...")
    await db.collection("scouts").createIndex({ email: 1 }, { unique: true })
    await db.collection("scouts").createIndex({ isVerified: 1 })
    await db.collection("scouts").createIndex({ licenseNumber: 1 })

    // Create indexes for parents collection
    console.log("📊 Creating indexes for parents collection...")
    await db.collection("parents").createIndex({ email: 1 }, { unique: true })

    console.log("✅ All indexes created successfully!")
  } catch (error) {
    console.error("❌ Error creating indexes:", error)
  } finally {
    await client.close()
    console.log("🔌 Connection closed")
  }
}

createIndexes()
