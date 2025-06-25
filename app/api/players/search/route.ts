// app/api/players/search/route.ts

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb'; // Corrected import for MongoDB native client
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
    // await mongoose.connect(process.env.MONGODB_URI!); // Only if not connected globally

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('name') || '';
    const county = searchParams.get('county') || 'all';
    const sport = searchParams.get('sport') || 'all';

    // Build the query object for Mongoose
    const query: any = {
      role: 'player' // Crucial: Only search for documents with role 'player'
    };

    if (searchTerm) {
      // Case-insensitive search for player's first or last name
      query.$or = [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    if (county !== 'all') {
      query.county = county;
    }
    if (sport !== 'all') {
      query.sport = sport;
    }

    // Fetch players using the PlayerModel discriminator
    const players = await PlayerModel.find(query, {
      firstName: 1,
      lastName: 1,
      sport: 1,
      position: 1,
      county: 1,
      dateOfBirth: 1,
      profileImageUrl: 1,
      aiScore: 1
    }).limit(50); // Add a limit to prevent fetching too many results at once

    // Transform the data to match your frontend Player type
    const formattedPlayers = players.map(player => ({
      id: player._id.toString(),
      name: `${player.firstName} ${player.lastName}`, // Combine first and last name
      sport: player.sport,
      position: player.position,
      county: player.county,
      age: calculateAge(player.dateOfBirth),
      aiScore: player.aiScore || 0,
      avatar: player.profileImageUrl || "/placeholder.svg"
    }));

    return NextResponse.json(formattedPlayers);

  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
