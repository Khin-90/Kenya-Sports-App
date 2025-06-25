// app/api/scout/profile/route.ts

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose'; // Your Mongoose connection utility
import { ScoutModel } from '@/lib/models/users'; // Import the ScoutModel discriminator
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

    // --- TEMPORARY: Use a hardcoded scoutId for testing if auth is not fully set up ---
    // Replace with a valid ObjectId from your database for a scout user
    const scoutId = '60c72b2f9b1e8b001c8e4d1b'; // Example ID, replace with a real one
    // --- END TEMPORARY ---

    const scoutProfile = await ScoutModel.findById(scoutId).select('-passwordHash'); // Exclude password hash

    if (!scoutProfile) {
      return NextResponse.json({ error: 'Scout profile not found' }, { status: 404 });
    }

    // Return the scout's profile data
    return NextResponse.json(scoutProfile);

  } catch (error) {
    console.error('Error fetching scout profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
