// app/api/scout/contact-history/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose'; // Your Mongoose connection utility
import { ContactRequest } from '@/lib/models/ScoutView'; // Import ContactRequest model
import { PlayerModel } from '@/lib/models/users'; // Import PlayerModel for population
// import { getServerSession } from 'next-auth'; // Uncomment if using next-auth
// import { authOptions } from '@/lib/auth'; // Your next-auth options

export async function GET(request: Request) {
  await dbConnect(); // Connect to MongoDB

  try {
    // --- Authentication: Get scoutId from session ---
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user || !session.user.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const scoutId = session.user.id;

    // --- TEMPORARY: Use a hardcoded scoutId for testing ---
    const scoutId = '60c72b2f9b1e8b001c8e4d1b'; // Example ID, replace with a real one
    // --- END TEMPORARY ---

    const contactHistory = await ContactRequest.find({ scoutId: scoutId })
      .populate({
        path: 'playerId',
        model: PlayerModel, // Populate with Player details
        select: 'firstName lastName sport profileImageUrl' // Select relevant player fields
      })
      .sort({ createdAt: -1 }); // Sort by most recent first

    // Format the data for the frontend
    const formattedHistory = contactHistory.map(record => ({
      id: record._id.toString(),
      player: record.playerId ? `${(record.playerId as any).firstName} ${(record.playerId as any).lastName}` : 'Unknown Player',
      playerId: record.playerId ? (record.playerId as any)._id.toString() : null,
      playerAvatar: record.playerId ? (record.playerId as any).profileImageUrl || '/placeholder.svg' : '/placeholder.svg',
      type: 'Contact Request', // Assuming all records here are contact requests
      status: record.status,
      date: record.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time: record.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return NextResponse.json(formattedHistory);

  } catch (error) {
    console.error('Error fetching contact history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
