const { MongoClient } = require("mongodb");

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  tls: true,
  retryWrites: true,
  w: "majority",
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  monitorCommands: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export client promise
module.exports = {
  clientPromise,

  // Get a specific database
  getDatabase: async function () {
    const client = await clientPromise;
    return client.db("talentscout_kenya");
  },

  // Constant collection names
  COLLECTIONS: {
    USERS: "users",
    PLAYERS: "players",
    SCOUTS: "scouts",
    PARENTS: "parents",
    PLAYER_STATS: "player_stats",
    VIDEOS: "videos",
    AI_ANALYSES: "ai_analyses",
    SCOUT_REQUESTS: "scout_requests",
    OPPORTUNITIES: "opportunities",
    OPPORTUNITY_APPLICATIONS: "opportunity_applications",
    ACTIVITY_LOGS: "activity_logs",
    ENDORSEMENTS: "endorsements",
    NOTIFICATIONS: "notifications",
    COUNTIES: "counties",
    SPORTS: "sports",
  },

  // Test connection utility
  testConnection: async function () {
    try {
      const client = await clientPromise;
      await client.db("admin").command({ ping: 1 });
      console.log("✅ MongoDB Atlas connection successful");
      return true;
    } catch (error) {
      console.error("❌ MongoDB Atlas connection failed:", error);
      return false;
    }
  }
};
