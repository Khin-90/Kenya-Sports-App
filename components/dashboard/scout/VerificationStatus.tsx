// components/dashboard/scout/VerificationStatus.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const VerificationStatus: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Club License</span>
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Identity Document</span>
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Background Check</span>
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;
