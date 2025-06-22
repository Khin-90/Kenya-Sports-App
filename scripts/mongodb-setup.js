require('dotenv').config();
// MongoDB Atlas setup script for TalentScout Kenya
// Run this script to create indexes and seed data

const { MongoClient } = require("mongodb")

// Check if MONGODB_URI is provided
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is required")
  console.log("Please set your MongoDB Atlas connection string:")
  console.log("export MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/talentscout_kenya'")
  process.exit(1)
}

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = "talentscout_kenya"

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI, {
    retryWrites: true,
    w: "majority",
  })

  try {
    console.log("🔗 Connecting to MongoDB Atlas...")
    await client.connect()

    // Test connection
    await client.db("admin").command({ ping: 1 })
    console.log("✅ Connected to MongoDB Atlas successfully!")

    const db = client.db(DB_NAME)

    // Create indexes for better performance
    console.log("📊 Creating database indexes...")

    // Users collection indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ role: 1 })
    await db.collection("users").createIndex({ county: 1 })
    await db.collection("users").createIndex({ isActive: 1 })
    await db.collection("users").createIndex({ createdAt: -1 })

    // Players collection indexes
    await db.collection("players").createIndex({ email: 1 }, { unique: true })
    await db.collection("players").createIndex({ sport: 1 })
    await db.collection("players").createIndex({ aiScore: -1 })
    await db.collection("players").createIndex({ county: 1 })
    await db.collection("players").createIndex({ dateOfBirth: 1 })
    await db.collection("players").createIndex({ "privacySettings.profileVisible": 1 })
    await db.collection("players").createIndex({ parentId: 1 })
    await db.collection("players").createIndex({ sport: 1, county: 1 })
    await db.collection("players").createIndex({ sport: 1, aiScore: -1 })

    // Scouts collection indexes
    await db.collection("scouts").createIndex({ email: 1 }, { unique: true })
    await db.collection("scouts").createIndex({ isVerified: 1 })
    await db.collection("scouts").createIndex({ verificationStatus: 1 })
    await db.collection("scouts").createIndex({ licenseNumber: 1 })
    await db.collection("scouts").createIndex({ clubName: 1 })
    await db.collection("scouts").createIndex({ organizationType: 1 })

    // Parents collection indexes
    await db.collection("parents").createIndex({ email: 1 }, { unique: true })
    await db.collection("parents").createIndex({ childrenIds: 1 })

    // Scout requests indexes
    await db.collection("scout_requests").createIndex({ playerId: 1 })
    await db.collection("scout_requests").createIndex({ scoutId: 1 })
    await db.collection("scout_requests").createIndex({ status: 1 })
    await db.collection("scout_requests").createIndex({ createdAt: -1 })
    await db.collection("scout_requests").createIndex({ playerId: 1, status: 1 })

    // Videos collection indexes
    await db.collection("videos").createIndex({ playerId: 1 })
    await db.collection("videos").createIndex({ uploadStatus: 1 })
    await db.collection("videos").createIndex({ isPublic: 1 })
    await db.collection("videos").createIndex({ createdAt: -1 })
    await db.collection("videos").createIndex({ playerId: 1, isPublic: 1 })

    // AI analyses indexes
    await db.collection("ai_analyses").createIndex({ videoId: 1 })
    await db.collection("ai_analyses").createIndex({ overallScore: -1 })
    await db.collection("ai_analyses").createIndex({ createdAt: -1 })

    // Opportunities indexes
    await db.collection("opportunities").createIndex({ sport: 1 })
    await db.collection("opportunities").createIndex({ county: 1 })
    await db.collection("opportunities").createIndex({ isActive: 1 })
    await db.collection("opportunities").createIndex({ applicationDeadline: 1 })
    await db.collection("opportunities").createIndex({ opportunityType: 1 })
    await db.collection("opportunities").createIndex({ sport: 1, county: 1, isActive: 1 })

    // Activity logs indexes
    await db.collection("activity_logs").createIndex({ userId: 1 })
    await db.collection("activity_logs").createIndex({ createdAt: -1 })
    await db.collection("activity_logs").createIndex({ action: 1 })
    await db.collection("activity_logs").createIndex({ userId: 1, createdAt: -1 })

    // Notifications indexes
    await db.collection("notifications").createIndex({ userId: 1 })
    await db.collection("notifications").createIndex({ isRead: 1 })
    await db.collection("notifications").createIndex({ createdAt: -1 })
    await db.collection("notifications").createIndex({ userId: 1, isRead: 1 })

    // Counties and Sports indexes
    await db.collection("counties").createIndex({ name: 1 }, { unique: true })
    await db.collection("counties").createIndex({ region: 1 })
    await db.collection("sports").createIndex({ name: 1 }, { unique: true })
    await db.collection("sports").createIndex({ category: 1 })

    console.log("✅ Database indexes created successfully!")

    // Seed the database with sample data
    console.log("🌱 Seeding database with sample data...")

    // Import and run seeding function
    const { seedDatabase } = require("../lib/seed-data.js")
    await seedDatabase()

    console.log("🎉 Database setup completed successfully!")
    console.log("\n📋 Login Credentials:")
    console.log("Players:")
    console.log("  - john.kamau@email.com / password")
    console.log("  - mary.wanjiku@email.com / password")
    console.log("  - david.ochieng@email.com / password")
    console.log("\nScouts:")
    console.log("  - james.mwangi@scout.com / password")
    console.log("  - mary.njeri@scout.com / password")
    console.log("\nParents:")
    console.log("  - parent.kamau@email.com / password")
    console.log("  - parent.wanjiku@email.com / password")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the setup
setupDatabase()
