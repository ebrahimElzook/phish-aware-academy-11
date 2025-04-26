
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoUploader } from '@/components/lms/VideoUploader';
import { CampaignList } from '@/components/lms/CampaignList';
import { CampaignCreator } from '@/components/lms/CampaignCreator';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  Shield, 
  Home, 
  LayoutDashboard, 
  FileText, 
  LineChart, 
  Bot, 
  BookOpen, 
  Video, 
  Settings 
} from 'lucide-react';

const LMSCampaigns = () => {
  const { toast } = useToast();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <div className="mb-8 px-4">
              <Link to="/" className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-phish-600" />
                <span className="text-2xl font-bold text-phish-600">PhishAware</span>
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/" className="flex items-center gap-3 py-2">
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard" className="flex items-center gap-3 py-2">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/templates" className="flex items-center gap-3 py-2">
                        <FileText className="h-5 w-5" />
                        <span>Templates</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/analytics" className="flex items-center gap-3 py-2">
                        <LineChart className="h-5 w-5" />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/lms-campaigns" className="flex items-center gap-3 py-2 text-phish-600 font-medium">
                        <BookOpen className="h-5 w-5" />
                        <span>LMS</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/ai-support" className="flex items-center gap-3 py-2">
                        <Bot className="h-5 w-5" />
                        <span>AI Support</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Video className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold">LMS Management</h1>
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

              <TabsContent value="settings">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">LMS Settings</h2>
                  <p className="text-gray-600">Configure your LMS preferences and settings here.</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LMSCampaigns;
