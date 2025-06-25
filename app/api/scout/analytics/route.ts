// app/api/scout/analytics/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose'; // Your Mongoose connection utility
import { ScoutView, ContactRequest } from '@/lib/models/ScoutView'; // Import ScoutView and ContactRequest models
import { SavedPlayerModel } from '@/lib/models/SavedPlayer'; // Import SavedPlayerModel
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

    // Fetch various counts for analytics
    const totalPlayersViewed = await ScoutView.countDocuments({ scoutId: scoutId });
    const totalContactRequests = await ContactRequest.countDocuments({ scoutId: scoutId });
    const approvedContactRequests = await ContactRequest.countDocuments({ scoutId: scoutId, status: 'APPROVED' });
    const pendingContactRequests = await ContactRequest.countDocuments({ scoutId: scoutId, status: 'PENDING' });
    const totalSavedPlayers = await SavedPlayerModel.countDocuments({ scoutId: scoutId });

    // Calculate success rate (avoid division by zero)
    const contactSuccessRate = totalContactRequests > 0
      ? (approvedContactRequests / totalContactRequests) * 100
      : 0;

    // You can add more complex aggregations here, e.g.,
    // - Players viewed per sport/county
    // - Average AI score of players contacted
    // - Trends over time

    const analyticsData = {
      totalPlayersViewed,
      totalContactRequests,
      approvedContactRequests,
      pendingContactRequests,
      contactSuccessRate: parseFloat(contactSuccessRate.toFixed(2)), // Format to 2 decimal places
      totalSavedPlayers,
      // Add more metrics as needed
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Error fetching scouting analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
