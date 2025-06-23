// components/dashboard/scout/RecentActivityFeed.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Activity } from "@/lib/types"; // Import the Activity interface

interface RecentActivityFeedProps {
  activities: Activity[];
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {activity.type === "contact_request" && "Contact request sent"}
                    {activity.type === "profile_view" && "Profile viewed"}
                    {activity.type === "contact_approved" && "Contact approved"}
                  </p>
                  <p className="text-xs text-gray-500">{activity.player}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                <Badge variant={activity.status === "approved" ? "default" : "secondary"} className="text-xs">
                  {activity.status}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No recent activity.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
