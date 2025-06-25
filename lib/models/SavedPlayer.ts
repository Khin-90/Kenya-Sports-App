// lib/models/SavedPlayer.ts
import mongoose, { Schema, models, Document } from 'mongoose';

// Define an interface for the SavedPlayer document
export interface ISavedPlayer extends Document {
  scoutId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SavedPlayerSchema: Schema<ISavedPlayer> = new Schema(
  {
    // Reference to the User who is the scout
    scoutId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assuming your User model is named 'User'
      index: true, // Index for faster lookup by scout
    },
    // Reference to the User who is the player
    playerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assuming your User model is named 'User'
      index: true, // Index for faster lookup by player
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Add a unique compound index to prevent a scout from saving the same player multiple times
SavedPlayerSchema.index({ scoutId: 1, playerId: 1 }, { unique: true });

// Export the Mongoose model
export const SavedPlayerModel = (models.SavedPlayer || mongoose.model<ISavedPlayer>('SavedPlayer', SavedPlayerSchema));
