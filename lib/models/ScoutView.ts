// lib/models/ScoutView.ts
import mongoose, { Schema } from "mongoose";

const ScoutViewSchema = new Schema({
  scoutId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  playerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  viewedAt: { type: Date, default: Date.now }
});

export const ScoutView = mongoose.models.ScoutView || mongoose.model("ScoutView", ScoutViewSchema);

const ContactRequestSchema = new Schema({
  scoutId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  playerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
  lastContactDate: { type: Date }
});

export const ContactRequest = mongoose.models.ContactRequest || mongoose.model("ContactRequest", ContactRequestSchema);
