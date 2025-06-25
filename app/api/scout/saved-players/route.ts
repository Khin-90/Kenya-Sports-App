// app/api/scout/saved-players/route.ts

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb'; // Corrected import for MongoDB native client
import { SavedPlayerModel } from '@/lib/models/SavedPlayer';
import { PlayerModel } from '@/lib/models/users'; // <--- CORRECTED: Import PlayerModel from your users model file
import mongoose from 'mongoose'; // Import mongoose for ObjectId if not already

// Helper function to calculate age (ensure this is available or imported)
function calculateAge(dateOfBirth: Date | string): number {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const diff_ms = Date.now() - dob.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export async function GET(request: Request) {
  try {
    // Ensure Mongoose is connected.
    // If your `lib/mongodb.ts` only provides a native MongoDB client,
    // you might need a separate `mongoose.connect()` call somewhere
    // in your application's entry point or a dedicated Mongoose connection file.
    // The `getDatabase()` call here is for the native client, not Mongoose.
    // Mongoose models will automatically use the connection established by `mongoose.connect()`.
    // If you don't have a global `mongoose.connect()` yet, you might add it here for now:
    // await mongoose.connect(process.env.MONGODB_URI!); // Only if not connected globally

    // Placeholder for scoutId - REPLACE WITH ACTUAL AUTHENTICATION LOGIC
    // Example: const session = await getServerSession(authOptions);
    // if (!session || !session.user || !session.user.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // const scoutId = new mongoose.Types.ObjectId(session.user.id);
    const scoutId = new mongoose.Types.ObjectId('60c72b2f9b1e8b001c8e4d1a'); // TEMPORARY: Use a valid ObjectId from your DB for testing

    const savedPlayers = await SavedPlayerModel.find({ scoutId: scoutId })
      .populate({
        path: 'playerId',
        model: PlayerModel, // <--- CORRECTED: Use the PlayerModel discriminator
        select: 'firstName lastName sport position county dateOfBirth profileImageUrl aiScore' // Select fields you need
      });
    
    const formattedSavedPlayers = savedPlayers.map(sp => {
      // The populated `playerId` will be a full Player document
      const player = sp.playerId as any; // Cast to any for easier access to populated fields

      if (!player) return null; // Handle cases where player might not be found (e.g., deleted)

      return {
        id: player._id.toString(),
        name: `${player.firstName} ${player.lastName}`, // Combine first and last name
        sport: player.sport,
        position: player.position,
        county: player.county,
        age: calculateAge(player.dateOfBirth),
        aiScore: player.aiScore || 0,
        avatar: player.profileImageUrl || "/placeholder.svg"
      };
    }).filter(Boolean); // Filter out any null entries

    return NextResponse.json(formattedSavedPlayers);
  } catch (error) {
    console.error('Error fetching saved players:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
