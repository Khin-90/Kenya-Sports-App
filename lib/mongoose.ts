// lib/mongoose.ts
import mongoose from 'mongoose';

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Throw a more descriptive error if the URI is not defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local. ' +
    'This should be the connection string for your MongoDB database.'
  );
}

// Type definition for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object with TypeScript declaration merging
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// Initialize the cached connection object with proper type safety
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to the MongoDB database using Mongoose.
 * This function ensures that only one connection is established and reused.
 * @returns {Promise<typeof mongoose>} A promise that resolves to the Mongoose instance.
 * @throws {Error} If the connection fails
 */
export async function dbConnect(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if none exists
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable Mongoose's internal buffering
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((error) => {
        // Clear the promise on failure to allow retries
        cached.promise = null;
        throw new Error(`MongoDB connection error: ${error.message}`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear the cached connection on error
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}

// Optional: Export a function to disconnect from MongoDB
export async function dbDisconnect(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}