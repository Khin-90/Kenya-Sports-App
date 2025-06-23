// components/dashboard/scout/QuickActions.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Trophy } from "lucide-react";
import Link from "next/link";

const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/scout/saved-players" aria-label="View saved players">
            <Star className="h-4 w-4 mr-2" />
            Saved Players
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/scout/contact-history" aria-label="View contact history">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact History
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/scout/analytics" aria-label="View scouting analytics">
            <Trophy className="h-4 w-4 mr-2" />
            Scouting Analytics
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
