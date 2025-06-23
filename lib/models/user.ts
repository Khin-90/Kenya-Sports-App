import type { ObjectId } from "mongodb";

// Add these type helpers
type Sport = "football" | "basketball" | "rugby" | "athletics" | "swimming" | "volleyball" | "cricket" | "handball" | "netball" | "field_hockey" | "tennis" | "boxing" | "weightlifting"; // Added more sports popular in Kenya
type Position = Sport extends "football" ? "goalkeeper" | "defender" | "midfielder" | "forward" : 
               Sport extends "basketball" ? "guard" | "forward" | "center" : 
               Sport extends "rugby" ? "prop" | "hooker" | "lock" | "flanker" | "number_8" | "scrum_half" | "fly_half" | "center" | "wing" | "fullback" :
               Sport extends "volleyball" ? "setter" | "outside_hitter" | "opposite_hitter" | "middle_blocker" | "libero" :
               Sport extends "cricket" ? "batsman" | "bowler" | "wicket_keeper" | "all_rounder" :
               Sport extends "handball" ? "goalkeeper" | "pivot" | "wing" | "back" :
               Sport extends "field_hockey" ? "goalkeeper" | "defender" | "midfielder" | "forward" :
               string; // General string for sports without specific positions or for more granular positions

export interface BaseUser {
  _id: ObjectId;
  email: string; // Consider adding format validation
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  dateOfBirth: Date;
  role: "player" | "scout" | "parent";
  profileImageUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Player extends BaseUser {
  role: "player";
  sport: Sport;
  position?: Position;
  bio?: string;
  aiScore: number; // Consider min/max (e.g., 0-100)
  height?: number; // in cm (add min/max)
  weight?: number; // in kg (add min/max)
  parentId?: ObjectId;
  privacySettings: {
    profileVisible: boolean;
    allowScoutContact: boolean;
    showPersonalInfo: boolean;
    allowVideoAnalysis: boolean;
  };
  stats?: {
    matches: number;
    goals?: number;
    assists?: number;
    points?: number;
    personalBest?: string;
    medals?: number;
  };
}

export interface Scout extends BaseUser {
  role: "scout";
  clubName: string;
  licenseNumber: string;
  organizationType: "club" | "academy" | "national" | "independent";
  specialization?: Sport[];
  isVerified: boolean;
  verificationDocuments: string[];
  verificationStatus: "pending" | "approved" | "rejected";
  verifiedAt?: Date;
}

export interface Parent extends BaseUser {
  role: "parent";
  childrenIds: ObjectId[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Improved related interfaces with stricter typing
export interface PlayerStats {
  _id: ObjectId;
  playerId: ObjectId;
  sport: Sport;
  season: string; // Could use "YYYY-YYYY" format
  matchesPlayed: number;
  goals?: number;
  assists?: number;
  points?: number;
  minutesPlayed?: number;
  yellowCards?: number;
  redCards?: number;
  personalBest?: string;
  medals?: number;
  additionalStats: Record<string, unknown>; // More type-safe than 'any'
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  _id: ObjectId;
  playerId: ObjectId;
  title: string;
  description?: string;
  videoUrl: string;
  cloudinaryId?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  fileSizeMB?: number;
  uploadStatus: "processing" | "completed" | "failed";
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAnalysis {
  _id: ObjectId;
  videoId: ObjectId;
  overallScore: number; // 0-100
  technicalSkills: number; // 0-100
  physicalAttributes: number; // 0-100
  tacticalAwareness: number; // 0-100
  mentalStrength: number; // 0-100
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  detailedAnalysis?: string;
  analysisVersion: string;
  processingTimeSeconds?: number;
  createdAt: Date;
}

// Add string literal types for statuses
type ScoutRequestStatus = "pending" | "approved" | "rejected" | "expired";
type OpportunityType = "tryout" | "academy" | "scholarship" | "camp" | "tournament";

export interface ScoutRequest {
  _id: ObjectId;
  scoutId: ObjectId;
  playerId: ObjectId;
  message: string;
  status: ScoutRequestStatus;
  parentApprovalRequired: boolean;
  parentResponse?: string;
  expiresAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  _id: ObjectId;
  title: string;
  description: string;
  organizationName: string;
  organizationContact: {
    email: string;
    phone: string;
    website?: string;
  };
  sport: Sport;
  opportunityType: OpportunityType;
  ageRangeMin: number; // Add validation (e.g., 6-30)
  ageRangeMax: number;
  location: string;
  county: string;
  requirements: string[];
  applicationDeadline: Date;
  eventDate?: Date;
  maxParticipants?: number;
  currentParticipants: number;
  isActive: boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  _id: ObjectId;
  userId: ObjectId;
  action: string; // Could define specific actions
  resourceType: string; // Could define resource types
  resourceId?: ObjectId;
  details: Record<string, unknown>; // Better than 'any'
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Endorsement {
  _id: ObjectId;
  playerId: ObjectId;
  endorserName: string;
  endorserTitle: string;
  endorserOrganization: string;
  endorserContact: string;
  endorsementText: string;
  isVerified: boolean;
  verificationDate?: Date;
  createdAt: Date;
}

export interface Notification {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  message: string;
  type: string; // Could define specific types
  isRead: boolean;
  actionUrl?: string;
  metadata: Record<string, unknown>; // Better than 'any'
  createdAt: Date;
}
