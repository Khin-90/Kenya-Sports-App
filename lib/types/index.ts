// lib/types/index.ts

import { ObjectId } from "mongodb"; // Assuming ObjectId is used for IDs

// Base interfaces for data fetched from APIs
export interface ScoutStat {
  label: string;
  value: number;
  change?: string; // Optional, as it's not always present in your example
}

export interface Player {
  id: string; // Changed from _id to id for client-side consistency
  name: string;
  sport: string;
  position: string;
  county: string;
  age: number;
  aiScore: number;
  avatar?: string;
}

export interface Activity {
  type: "contact_request" | "profile_view" | "contact_approved";
  player: string;
  time: string;
  status: "pending" | "approved" | "rejected" | "completed"; // Added 'completed' for profile_view
}

// Interfaces for Mongoose Models (if different from API response)
// These should align with your lib/models/User.ts, lib/models/Video.ts, etc.
// For example, if your User model has preferredSports, preferredCounties:
export interface ScoutUser {
  _id: ObjectId;
  email: string;
  role: "scout";
  preferredSports?: string[];
  preferredCounties?: string[];
  // ... other scout-specific fields
}

// You might have more specific types for Video, Analysis, etc.
// For now, we'll stick to the ones directly used in the dashboard.
