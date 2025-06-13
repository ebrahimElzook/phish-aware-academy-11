
import { Link } from 'react-router-dom';
import { VideoLibrary } from '@/components/lms/VideoLibrary';
import { CampaignList } from '@/components/lms/CampaignList';
import React, { useState } from 'react';
import { CampaignCreator } from '@/components/lms/CampaignCreator';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Video, FileText, Users, Award } from 'lucide-react';
import CertificateCard from '@/components/lms/CertificateCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LMSCampaigns = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    toast
  } = useToast();

  // Mock certificates data for demonstration
  const mockCertificates = [{
    id: "cert1",
    title: "Password Security Basics",
    userName: "Alex Johnson",
    completionDate: new Date('2025-04-15')
  }, {
    id: "cert2",
    title: "Social Engineering Awareness",
    userName: "Alex Johnson",
    completionDate: new Date('2025-03-28')
  }, {
    id: "cert3",
    title: "Data Protection 101",
    userName: "Alex Johnson",
    completionDate: new Date('2025-02-10')
  }];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Video className="h-6 w-6 text-[#907527]" />
              <h1 className="text-2xl font-bold">LMS Management</h1>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link to="/employee-courses">
                
              </Link>
              <Link to="/profile-settings">
                
              </Link>
            </div>
          </div>

          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-6 grid-cols-3">
              <TabsTrigger value="videos" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Campaigns</span>
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Certificates</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <VideoLibrary />
            </TabsContent>

            <TabsContent value="campaigns">
              <div className="grid grid-cols-1 gap-6">
                <CampaignCreator onCreate={() => setRefreshKey(k => k + 1)} />
                <CampaignList key={refreshKey} />
              </div>
            </TabsContent>

            <TabsContent value="certificates">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Your Certificates
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCertificates.map(cert => <CertificateCard key={cert.id} id={cert.id} title={cert.title} userName={cert.userName} completionDate={cert.completionDate} />)}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LMSCampaigns;
