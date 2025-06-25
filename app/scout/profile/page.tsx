// app/scout/profile/page.tsx
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { User as UserIcon, Save, Loader2 } from "lucide-react";

// Assuming your Scout interface is defined in lib/types.ts
// If not, you might need to define it here or in a shared types file.
interface ScoutProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  dateOfBirth: string; // Or Date if you parse it
  clubName: string;
  licenseNumber: string;
  organizationType: string;
  specialization: string[];
  isVerified: boolean;
  verificationStatus: string;
  profileImageUrl?: string;
  // Add other fields as per your Scout model
}

export default function ScoutProfilePage() {
  const [scoutData, setScoutData] = useState<ScoutProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScoutProfile = async () => {
      try {
        const response = await fetch('/api/scout/profile');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: ScoutProfile = await response.json();
        setScoutData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch scout profile.");
        console.error("Error fetching scout profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScoutProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-label="Loading profile" />
        <p className="ml-2 text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <p className="text-xl mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!scoutData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p className="text-xl mb-4">No profile data available.</p>
        <Button asChild><Link href="/scout/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <Button asChild>
          <Link href="/scout/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Scout Profile Information
          </CardTitle>
          <CardDescription>View and update your personal and scouting preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={scoutData.firstName} readOnly />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={scoutData.lastName} readOnly />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={scoutData.email} readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={scoutData.phone} readOnly />
            </div>
            <div>
              <Label htmlFor="county">County</Label>
              <Input id="county" value={scoutData.county} readOnly />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" value={new Date(scoutData.dateOfBirth).toLocaleDateString()} readOnly />
            </div>
          </div>

          <h3 className="text-lg font-semibold pt-4">Scouting Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clubName">Club/Organization Name</Label>
              <Input id="clubName" value={scoutData.clubName} readOnly />
            </div>
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input id="licenseNumber" value={scoutData.licenseNumber} readOnly />
            </div>
            <div>
              <Label htmlFor="orgType">Organization Type</Label>
              <Input id="orgType" value={scoutData.organizationType} readOnly />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" value={scoutData.specialization.join(", ")} readOnly />
            </div>
            <div>
              <Label htmlFor="verificationStatus">Verification Status</Label>
              <Input id="verificationStatus" value={scoutData.verificationStatus} readOnly />
            </div>
          </div>

          {/* You might add an "Edit Profile" button here that leads to a form */}
          <Button className="w-full mt-4">
            <Save className="h-4 w-4 mr-2" />
            Edit Profile (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
