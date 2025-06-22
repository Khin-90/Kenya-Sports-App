// Test MongoDB connection and basic operations
const { MongoClient } = require("mongodb")

// Replace with your actual MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/talentscout_kenya"

async function testConnection() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()

    // Test connection
    await client.db("admin").command({ ping: 1 })
    console.log("✅ Connected to MongoDB successfully!")

    const db = client.db("talentscout_kenya")

    // Test inserting a simple document
    console.log("📝 Testing data insertion...")
    const testCollection = db.collection("test")

    const testDoc = {
      message: "Hello from TalentScout Kenya!",
      timestamp: new Date(),
      status: "connected",
    }

    const result = await testCollection.insertOne(testDoc)
    console.log("✅ Test document inserted:", result.insertedId)

    // Read the document back
    const retrieved = await testCollection.findOne({ _id: result.insertedId })
    console.log("✅ Test document retrieved:", retrieved)

    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId })
    console.log("✅ Test document cleaned up")

    console.log("🎉 MongoDB connection test successful!")
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
  } finally {
    await client.close()
    console.log("🔌 Connection closed")
  }
}

// Run the test
testConnection()
