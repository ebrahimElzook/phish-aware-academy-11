
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video } from 'lucide-react';

export const CampaignList = () => {
  // Mock data for demonstration
  const campaigns = [
    {
      id: 1,
      title: "Security Awareness Basics",
      audience: "All Employees",
      videoCount: 3,
    },
    {
      id: 2,
      title: "Advanced Phishing Prevention",
      audience: "IT Department",
      videoCount: 2,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Training Campaigns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{campaign.title}</h3>
                <p className="text-sm text-gray-500">
                  Target: {campaign.audience}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Video className="h-4 w-4" />
                  <span>{campaign.videoCount} videos</span>
                </div>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
