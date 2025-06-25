// app/scout/contact-history/page.tsx
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the interface for a contact record, matching your API response
interface ContactRecord {
  id: string;
  player: string;
  playerId: string;
  playerAvatar?: string;
  type: string;
  status: string;
  date: string;
  time: string;
}

export default function ContactHistoryPage() {
  const [contactRecords, setContactRecords] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactHistory = async () => {
      try {
        const response = await fetch('/api/scout/contact-history');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: ContactRecord[] = await response.json();
        setContactRecords(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch contact history.");
        console.error("Error fetching contact history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-label="Loading contact history" />
        <p className="ml-2 text-lg text-gray-600">Loading contact history...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact History</h1>
        <Button asChild>
          <Link href="/scout/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Your Player Interactions
          </CardTitle>
          <CardDescription>Review your past contact requests and profile views.</CardDescription>
        </CardHeader>
        <CardContent>
          {contactRecords.length > 0 ? (
            <div className="space-y-4">
              {contactRecords.map(record => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={record.playerAvatar} alt={record.player} />
                      <AvatarFallback>
                        {record.player.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{record.player}</p>
                      <p className="text-sm text-gray-600">{record.type} on {record.date} at {record.time}</p>
                    </div>
                  </div>
                  <Badge variant={record.status === 'APPROVED' ? 'default' : record.status === 'PENDING' ? 'secondary' : 'outline'}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No contact history found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
