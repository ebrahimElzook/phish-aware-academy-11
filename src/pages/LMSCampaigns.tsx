
import React from 'react';
import { VideoUploader } from '@/components/lms/VideoUploader';
import { CampaignList } from '@/components/lms/CampaignList';
import { Card } from '@/components/ui/card';

const LMSCampaigns = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">LMS Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoUploader />
        <CampaignList />
      </div>
    </div>
  );
};

export default LMSCampaigns;
