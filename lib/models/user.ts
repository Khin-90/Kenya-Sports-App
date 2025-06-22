import type { ObjectId } from "mongodb"

export interface BaseUser {
  _id?: ObjectId
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phone: string
  county: string
  dateOfBirth: Date
  role: "player" | "scout" | "parent"
  profileImageUrl?: string
  isVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Player extends BaseUser {
  role: "player"
  sport: string
  position?: string
  bio?: string
  aiScore: number
  height?: number // in cm
  weight?: number // in kg
  parentId?: ObjectId
  privacySettings: {
    profileVisible: boolean
    allowScoutContact: boolean
    showPersonalInfo: boolean
    allowVideoAnalysis: boolean
  }
  stats?: {
    matches: number
    goals?: number
    assists?: number
    points?: number
    personalBest?: string
    medals?: number
  }
}

export interface Scout extends BaseUser {
  role: "scout"
  clubName: string
  licenseNumber: string
  organizationType: string
  specialization?: string
  isVerified: boolean
  verificationDocuments: string[]
  verificationStatus: "pending" | "approved" | "rejected"
  verifiedAt?: Date
}

export interface Parent extends BaseUser {
  role: "parent"
  childrenIds: ObjectId[]
  notificationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export interface PlayerStats {
  _id?: ObjectId
  playerId: ObjectId
  sport: string
  season: string
  matchesPlayed: number
  goals?: number
  assists?: number
  points?: number
  minutesPlayed?: number
  yellowCards?: number
  redCards?: number
  personalBest?: string
  medals?: number
  additionalStats: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Video {
  _id?: ObjectId
  playerId: ObjectId
  title: string
  description?: string
  videoUrl: string
  cloudinaryId?: string
  thumbnailUrl?: string
  durationSeconds?: number
  fileSizeMB?: number
  uploadStatus: "processing" | "completed" | "failed"
  isPublic: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface AIAnalysis {
  _id?: ObjectId
  videoId: ObjectId
  overallScore: number
  technicalSkills: number
  physicalAttributes: number
  tacticalAwareness: number
  mentalStrength: number
  strengths: string[]
  areasForImprovement: string[]
  recommendations: string[]
  detailedAnalysis?: string
  analysisVersion: string
  processingTimeSeconds?: number
  createdAt: Date
}

export interface ScoutRequest {
  _id?: ObjectId
  scoutId: ObjectId
  playerId: ObjectId
  message: string
  status: "pending" | "approved" | "rejected" | "expired"
  parentApprovalRequired: boolean
  parentResponse?: string
  expiresAt: Date
  respondedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Opportunity {
  _id?: ObjectId
  title: string
  description: string
  organizationName: string
  organizationContact: {
    email: string
    phone: string
    website?: string
  }
  sport: string
  opportunityType: "tryout" | "academy" | "scholarship" | "camp" | "tournament"
  ageRangeMin: number
  ageRangeMax: number
  location: string
  county: string
  requirements: string[]
  applicationDeadline: Date
  eventDate?: Date
  maxParticipants?: number
  currentParticipants: number
  isActive: boolean
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface ActivityLog {
  _id?: ObjectId
  userId: ObjectId
  action: string
  resourceType: string
  resourceId?: ObjectId
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export interface Endorsement {
  _id?: ObjectId
  playerId: ObjectId
  endorserName: string
  endorserTitle: string
  endorserOrganization: string
  endorserContact: string
  endorsementText: string
  isVerified: boolean
  verificationDate?: Date
  createdAt: Date
}

export interface Notification {
  _id?: ObjectId
  userId: ObjectId
  title: string
  message: string
  type: string
  isRead: boolean
  actionUrl?: string
  metadata: Record<string, any>
  createdAt: Date
}
