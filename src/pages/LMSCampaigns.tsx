
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoUploader } from '@/components/lms/VideoUploader';
import { CampaignList } from '@/components/lms/CampaignList';
import { CampaignCreator } from '@/components/lms/CampaignCreator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Video, FileText, Settings, ShieldAlert, Info } from 'lucide-react';

const LMSCampaigns = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold">LMS Management</h1>
          </div>
          <p className="text-gray-600">Create and manage your video-based training campaigns</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="phishaware" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto mb-6 grid-cols-4">
          <TabsTrigger value="phishaware" className="flex items-center gap-1">
            <ShieldAlert className="h-4 w-4" />
            <span>Phishaware</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phishaware">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Phishing Protection</h2>
              </div>
              <p className="text-gray-600 mb-4">Monitor and manage your organization's phishing awareness campaigns and training progress.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Active Campaigns</p>
                      <p className="text-sm text-gray-600">3 campaigns running</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Risk Assessment</p>
                      <p className="text-sm text-gray-600">Medium risk level</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Check Report</Button>
                </div>
              </div>
            </Card>
            <CampaignList />
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VideoUploader />
            <CampaignList />
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 gap-6">
            <CampaignCreator />
            <CampaignList />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">LMS Settings</h2>
            <p className="text-gray-600">Configure your LMS preferences and settings here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LMSCampaigns;
