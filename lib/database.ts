import { getDatabase, COLLECTIONS } from "./mongodb"
import { ObjectId } from "mongodb"
import type { BaseUser, Player, Scout, Video, ScoutRequest } from "./models/user"
import bcrypt from "bcryptjs"

export class Database {
  private static instance: Database

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  // User operations
  async createUser(userData: Omit<BaseUser, "_id" | "createdAt" | "updatedAt">): Promise<BaseUser> {
    const db = await getDatabase()
    const now = new Date()

    const user: BaseUser = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(COLLECTIONS.USERS).insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  async findUserByEmail(email: string): Promise<BaseUser | null> {
    const db = await getDatabase()
    return (await db.collection(COLLECTIONS.USERS).findOne({ email })) as BaseUser | null
  }

  async findUserById(id: string | ObjectId): Promise<BaseUser | null> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id
    return (await db.collection(COLLECTIONS.USERS).findOne({ _id: objectId })) as BaseUser | null
  }

  async updateUser(id: string | ObjectId, updates: Partial<BaseUser>): Promise<boolean> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id

    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: objectId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  }

  // Player operations
  async createPlayer(playerData: Omit<Player, "_id" | "createdAt" | "updatedAt">): Promise<Player> {
    const db = await getDatabase()
    const now = new Date()

    const player: Player = {
      ...playerData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(COLLECTIONS.PLAYERS).insertOne(player)
    return { ...player, _id: result.insertedId }
  }

  async findPlayers(
    filters: {
      sport?: string
      county?: string
      ageMin?: number
      ageMax?: number
      minAiScore?: number
      limit?: number
      skip?: number
    } = {},
  ): Promise<Player[]> {
    const db = await getDatabase()
    const query: any = { role: "player", isActive: true }

    if (filters.sport) {
      query.sport = { $regex: filters.sport, $options: "i" }
    }

    if (filters.county) {
      query.county = { $regex: filters.county, $options: "i" }
    }

    if (filters.minAiScore) {
      query.aiScore = { $gte: filters.minAiScore }
    }

    if (filters.ageMin || filters.ageMax) {
      const now = new Date()
      const ageQuery: any = {}

      if (filters.ageMax) {
        const minBirthDate = new Date(now.getFullYear() - filters.ageMax - 1, now.getMonth(), now.getDate())
        ageQuery.$gte = minBirthDate
      }

      if (filters.ageMin) {
        const maxBirthDate = new Date(now.getFullYear() - filters.ageMin, now.getMonth(), now.getDate())
        ageQuery.$lte = maxBirthDate
      }

      query.dateOfBirth = ageQuery
    }

    let cursor = db.collection(COLLECTIONS.PLAYERS).find(query)

    if (filters.limit) {
      cursor = cursor.limit(filters.limit)
    }

    if (filters.skip) {
      cursor = cursor.skip(filters.skip)
    }

    // Sort by AI score descending
    cursor = cursor.sort({ aiScore: -1 })

    return (await cursor.toArray()) as Player[]
  }

  async findPlayerById(id: string | ObjectId): Promise<Player | null> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id
    return (await db.collection(COLLECTIONS.PLAYERS).findOne({ _id: objectId })) as Player | null
  }

  async updatePlayerAiScore(playerId: string | ObjectId, aiScore: number): Promise<boolean> {
    const db = await getDatabase()
    const objectId = typeof playerId === "string" ? new ObjectId(playerId) : playerId

    const result = await db.collection(COLLECTIONS.PLAYERS).updateOne(
      { _id: objectId },
      {
        $set: {
          aiScore,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  }

  // Scout operations
  async createScout(scoutData: Omit<Scout, "_id" | "createdAt" | "updatedAt">): Promise<Scout> {
    const db = await getDatabase()
    const now = new Date()

    const scout: Scout = {
      ...scoutData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(COLLECTIONS.SCOUTS).insertOne(scout)
    return { ...scout, _id: result.insertedId }
  }

  async findScoutById(id: string | ObjectId): Promise<Scout | null> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id
    return (await db.collection(COLLECTIONS.SCOUTS).findOne({ _id: objectId })) as Scout | null
  }

  async updateScoutVerification(scoutId: string | ObjectId, status: "approved" | "rejected"): Promise<boolean> {
    const db = await getDatabase()
    const objectId = typeof scoutId === "string" ? new ObjectId(scoutId) : scoutId

    const result = await db.collection(COLLECTIONS.SCOUTS).updateOne(
      { _id: objectId },
      {
        $set: {
          verificationStatus: status,
          isVerified: status === "approved",
          verifiedAt: status === "approved" ? new Date() : undefined,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  }

  // Scout request operations
  async createScoutRequest(requestData: Omit<ScoutRequest, "_id" | "createdAt" | "updatedAt">): Promise<ScoutRequest> {
    const db = await getDatabase()
    const now = new Date()

    const request: ScoutRequest = {
      ...requestData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(COLLECTIONS.SCOUT_REQUESTS).insertOne(request)
    return { ...request, _id: result.insertedId }
  }

  async findScoutRequestsByPlayer(playerId: string | ObjectId): Promise<ScoutRequest[]> {
    const db = await getDatabase()
    const objectId = typeof playerId === "string" ? new ObjectId(playerId) : playerId

    return (await db
      .collection(COLLECTIONS.SCOUT_REQUESTS)
      .find({ playerId: objectId })
      .sort({ createdAt: -1 })
      .toArray()) as ScoutRequest[]
  }

  async updateScoutRequestStatus(
    requestId: string | ObjectId,
    status: "approved" | "rejected",
    parentResponse?: string,
  ): Promise<boolean> {
    const db = await getDatabase()
    const objectId = typeof requestId === "string" ? new ObjectId(requestId) : requestId

    const result = await db.collection(COLLECTIONS.SCOUT_REQUESTS).updateOne(
      { _id: objectId },
      {
        $set: {
          status,
          parentResponse,
          respondedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  }

  // Video operations
  async createVideo(videoData: Omit<Video, "_id" | "createdAt" | "updatedAt">): Promise<Video> {
    const db = await getDatabase()
    const now = new Date()

    const video: Video = {
      ...videoData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(COLLECTIONS.VIDEOS).insertOne(video)
    return { ...video, _id: result.insertedId }
  }

  async findVideosByPlayer(playerId: string | ObjectId): Promise<Video[]> {
    const db = await getDatabase()
    const objectId = typeof playerId === "string" ? new ObjectId(playerId) : playerId

    return (await db
      .collection(COLLECTIONS.VIDEOS)
      .find({ playerId: objectId })
      .sort({ createdAt: -1 })
      .toArray()) as Video[]
  }

  // Utility functions
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Leaderboard operations
  async getLeaderboard(
    filters: {
      sport?: string
      county?: string
      ageGroup?: string
      limit?: number
    } = {},
  ): Promise<Player[]> {
    const db = await getDatabase()
    const query: any = {
      role: "player",
      isActive: true,
      "privacySettings.profileVisible": true,
    }

    if (filters.sport) {
      query.sport = { $regex: filters.sport, $options: "i" }
    }

    if (filters.county) {
      query.county = { $regex: filters.county, $options: "i" }
    }

    if (filters.ageGroup) {
      const now = new Date()
      let ageMin = 0,
        ageMax = 100

      switch (filters.ageGroup) {
        case "under-16":
          ageMax = 15
          break
        case "16-18":
          ageMin = 16
          ageMax = 18
          break
        case "18-21":
          ageMin = 18
          ageMax = 21
          break
        case "over-21":
          ageMin = 21
          break
      }

      const minBirthDate = new Date(now.getFullYear() - ageMax - 1, now.getMonth(), now.getDate())
      const maxBirthDate = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate())

      query.dateOfBirth = { $gte: minBirthDate, $lte: maxBirthDate }
    }

    return (await db
      .collection(COLLECTIONS.PLAYERS)
      .find(query)
      .sort({ aiScore: -1 })
      .limit(filters.limit || 50)
      .toArray()) as Player[]
  }
}

export const db = Database.getInstance()
