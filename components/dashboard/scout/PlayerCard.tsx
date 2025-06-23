// components/dashboard/scout/PlayerCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, MapPin } from "lucide-react";
import { Player } from "@/lib/types"; // Import the Player interface

interface PlayerCardProps {
  player: Player;
  index: number; // For staggered animation
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }} // Staggered animation
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
          <AvatarFallback>
            {player.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{player.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>
              {player.sport} - {player.position}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-label="County" />
              {player.county}
            </span>
            <span>•</span>
            <span>Age {player.age}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">{player.aiScore}</div>
          <div className="text-xs text-gray-500">AI Score</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" aria-label={`View ${player.name}'s profile`}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" aria-label={`Message ${player.name}`}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
