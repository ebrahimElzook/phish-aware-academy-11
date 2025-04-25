
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoUploader } from '@/components/lms/VideoUploader';
import { CampaignList } from '@/components/lms/CampaignList';
import { CampaignCreator } from '@/components/lms/CampaignCreator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Video, FileText, Settings } from 'lucide-react';

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
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Quick Navigation</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <Link to="/templates" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Email Templates</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Create and manage email templates
                    </p>
                  </Link>
                  <Link to="/analytics" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Analytics</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      View campaign analytics and reports
                    </p>
                  </Link>
                  <Link to="/ai-support" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">AI Support</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Get AI-powered assistance
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
