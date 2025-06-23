// lib/models/User.ts
import mongoose, { Schema, Document } from "mongoose";
// Assuming your user.ts with interfaces is in lib/types/user.ts
import { BaseUser, Player, Scout, Parent } from "@/lib/types/user";

// Define the Mongoose Schema for BaseUser
// We extend Document to include Mongoose's _id and other properties
const BaseUserSchema = new Schema<BaseUser & Document>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  county: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  role: { type: String, enum: ["player", "scout", "parent"], required: true },
  profileImageUrl: { type: String },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { discriminatorKey: 'role', timestamps: true }); // Use discriminatorKey for different roles and add timestamps

// Define the Mongoose Schema for Player
const PlayerSchema = new Schema<Player & Document>({
  sport: { type: String, required: true },
  position: { type: String },
  bio: { type: String },
  aiScore: { type: Number, default: 0, min: 0, max: 100 }, // Added min/max as per your comment
  height: { type: Number, min: 50, max: 250 }, // Example min/max for height in cm
  weight: { type: Number, min: 20, max: 200 }, // Example min/max for weight in kg
  parentId: { type: Schema.Types.ObjectId, ref: "User" },
  privacySettings: {
    profileVisible: { type: Boolean, default: true },
    allowScoutContact: { type: Boolean, default: true },
    showPersonalInfo: { type: Boolean, default: false },
    allowVideoAnalysis: { type: Boolean, default: true },
  },
  stats: {
    matches: { type: Number, default: 0 },
    goals: { type: Number },
    assists: { type: Number },
    points: { type: Number },
    personalBest: { type: String },
    medals: { type: Number },
  },
});

// Define the Mongoose Schema for Scout
const ScoutSchema = new Schema<Scout & Document>({
  clubName: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  organizationType: { type: String, enum: ["club", "academy", "national", "independent"], required: true },
  specialization: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  verificationDocuments: [{ type: String }],
  verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  verifiedAt: { type: Date },
});

// Define the Mongoose Schema for Parent
const ParentSchema = new Schema<Parent & Document>({
  childrenIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
  },
});

// Create the main User model
// This checks if the model already exists to prevent recompilation in development
const UserModel = mongoose.models.User || mongoose.model("User", BaseUserSchema);

// Create discriminators for Player, Scout, and Parent
// This allows you to have a single 'User' collection but with different schemas based on the 'role' field.
export const User = UserModel;
export const PlayerModel = User.discriminator<Player & Document>("player", PlayerSchema);
export const ScoutModel = User.discriminator<Scout & Document>("scout", ScoutSchema);
export const ParentModel = User.discriminator<Parent & Document>("parent", ParentSchema);

// You might also want to export the main User model directly for general queries
export default User;
