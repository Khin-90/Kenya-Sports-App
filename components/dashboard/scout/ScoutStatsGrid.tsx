// components/dashboard/scout/ScoutStatsGrid.tsx

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { ScoutStat } from "@/lib/types"; // Import the ScoutStat interface

interface ScoutStatsGridProps {
  stats: ScoutStat[];
}

const ScoutStatsGrid: React.FC<ScoutStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            {stat.change && <p className="text-xs text-green-600 mt-2">{stat.change} this month</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScoutStatsGrid;
