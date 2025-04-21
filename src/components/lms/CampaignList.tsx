
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, ChartBarBig } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export const CampaignList = () => {
  const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null);
  
  // Mock data for demonstration
  const campaigns = [
    {
      id: 1,
      title: "Security Awareness Basics",
      audience: "All Employees",
      videoCount: 3,
      startDate: "2024-04-25",
      endDate: "2024-05-25",
      stats: {
        totalEnrolled: 150,
        completed: 85,
        inProgress: 45,
        notStarted: 20,
        averageCompletion: "78%"
      }
    },
    {
      id: 2,
      title: "Advanced Phishing Prevention",
      audience: "IT Department",
      videoCount: 2,
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      stats: {
        totalEnrolled: 50,
        completed: 30,
        inProgress: 15,
        notStarted: 5,
        averageCompletion: "85%"
      }
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
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    {campaign.videoCount} videos
                  </span>
                  <span>|</span>
                  <span>{campaign.startDate} - {campaign.endDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedCampaign(campaign)}>
                  <ChartBarBig className="h-4 w-4 mr-2" />
                  View Report
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Campaign Report: {selectedCampaign?.title}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Total Enrolled</p>
                  <p className="text-2xl font-bold">{selectedCampaign.stats.totalEnrolled}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{selectedCampaign.stats.completed}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCampaign.stats.inProgress}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Not Started</p>
                  <p className="text-2xl font-bold text-gray-600">{selectedCampaign.stats.notStarted}</p>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Start Date</TableCell>
                    <TableCell>{selectedCampaign.startDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>End Date</TableCell>
                    <TableCell>{selectedCampaign.endDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Completion Rate</TableCell>
                    <TableCell>{selectedCampaign.stats.averageCompletion}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Target Audience</TableCell>
                    <TableCell>{selectedCampaign.audience}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

