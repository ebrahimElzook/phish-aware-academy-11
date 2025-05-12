
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoUploader } from '@/components/lms/VideoUploader';
import { CampaignList } from '@/components/lms/CampaignList';
import { CampaignCreator } from '@/components/lms/CampaignCreator';
import { UserIntegrations } from '@/components/integrations/UserIntegrations';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  FileText, 
  Users,
  Award,
  Settings
} from 'lucide-react';
import CertificateCard from '@/components/lms/CertificateCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LMSCampaigns = () => {
  const { toast } = useToast();

  // Mock certificates data for demonstration
  const mockCertificates = [
    {
      id: "cert1",
      title: "Password Security Basics",
      userName: "Alex Johnson",
      completionDate: new Date('2025-04-15')
    },
    {
      id: "cert2",
      title: "Social Engineering Awareness",
      userName: "Alex Johnson",
      completionDate: new Date('2025-03-28')
    },
    {
      id: "cert3",
      title: "Data Protection 101",
      userName: "Alex Johnson",
      completionDate: new Date('2025-02-10')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Video className="h-6 w-6 text-[#907527]" />
            <h1 className="text-2xl font-bold">LMS Management</h1>
          </div>

          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-6 grid-cols-5">
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
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VideoUploader />
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Video Library</h2>
                  <p className="text-gray-600">Your uploaded videos will appear here.</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="campaigns">
              <div className="grid grid-cols-1 gap-6">
                <CampaignCreator />
                <CampaignList />
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
                  {mockCertificates.map(cert => (
                    <CertificateCard
                      key={cert.id}
                      id={cert.id}
                      title={cert.title}
                      userName={cert.userName}
                      completionDate={cert.completionDate}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="grid grid-cols-1 gap-6">
                <UserIntegrations />
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
      </div>
      
      <Footer />
    </div>
  );
};

export default LMSCampaigns;
