// lib/models/users.ts
import mongoose, { Schema, Document } from "mongoose";
// Adjust this import path if your interfaces are in a different location
import { BaseUser, Player, Scout, Parent } from "@/lib/models/user"; // Assuming lib/types/user.ts for interfaces

// Define the Mongoose Schema for BaseUser
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
}, { discriminatorKey: 'role', timestamps: true });

// Define the Mongoose Schema for Player
const PlayerSchema = new Schema<Player & Document>({
  sport: { type: String, required: true },
  position: { type: String },
  bio: { type: String },
  aiScore: { type: Number, default: 0, min: 0, max: 100 },
  height: { type: Number, min: 50, max: 250 },
  weight: { type: Number, min: 20, max: 200 },
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

// Export the main User model
export const User = UserModel;

// Define and export discriminators, checking if they already exist
// This pattern is safer for hot-reloading environments
export const PlayerModel = (UserModel.discriminators && UserModel.discriminators.player)
  ? (UserModel.discriminators.player as mongoose.Model<Player & Document>) // Cast to correct type
  : User.discriminator<Player & Document>("player", PlayerSchema);

export const ScoutModel = (UserModel.discriminators && UserModel.discriminators.scout)
  ? (UserModel.discriminators.scout as mongoose.Model<Scout & Document>) // Cast to correct type
  : User.discriminator<Scout & Document>("scout", ScoutSchema);

export const ParentModel = (UserModel.discriminators && UserModel.discriminators.parent)
  ? (UserModel.discriminators.parent as mongoose.Model<Parent & Document>) // Cast to correct type
  : User.discriminator<Parent & Document>("parent", ParentSchema);

// You might also want to export the main User model directly for general queries
export default User;
