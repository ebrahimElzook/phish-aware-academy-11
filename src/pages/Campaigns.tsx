
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { BarChart, Calendar, FileText, Mail, Plus, Search, Users, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CampaignDetails from '@/components/campaigns/CampaignDetails';
import CampaignForm from '@/components/campaigns/CampaignForm';
import CampaignList from '@/components/campaigns/CampaignList';
import { Badge } from '@/components/ui/badge';

// Mock data for campaign templates
const templates = [
  { id: 1, name: 'Password Reset', category: 'IT', difficulty: 'Medium' },
  { id: 2, name: 'Bonus Payment', category: 'HR', difficulty: 'Easy' },
  { id: 3, name: 'System Update', category: 'IT', difficulty: 'Hard' },
  { id: 4, name: 'Office Move', category: 'Admin', difficulty: 'Medium' },
];

// Mock data for completed campaigns
const completedCampaigns = [
  { 
    id: 1, 
    name: 'Password Security Campaign',
    template: 'Password Reset',
    startDate: '2024-04-10',
    endDate: '2024-04-20',
    targets: 85,
    clicks: 17,
    opens: 32,
    status: 'Completed',
    analytics: {
      emailOpens: [
        { email: 'john.doe@company.com', name: 'John Doe', department: 'IT', opened: true, clicked: true },
        { email: 'jane.smith@company.com', name: 'Jane Smith', department: 'Marketing', opened: true, clicked: false },
        { email: 'mike.johnson@company.com', name: 'Mike Johnson', department: 'HR', opened: false, clicked: false },
      ]
    }
  },
  { 
    id: 2, 
    name: 'HR Document Verification',
    template: 'Bonus Payment',
    startDate: '2024-03-15',
    endDate: '2024-03-25',
    targets: 50,
    clicks: 10,
    opens: 28,
    status: 'Completed',
    analytics: {
      emailOpens: [
        { email: 'robert.brown@company.com', name: 'Robert Brown', department: 'Finance', opened: true, clicked: true },
        { email: 'lisa.taylor@company.com', name: 'Lisa Taylor', department: 'HR', opened: true, clicked: true },
        { email: 'steve.wilson@company.com', name: 'Steve Wilson', department: 'IT', opened: true, clicked: false },
      ]
    }
  },
];

// Mock data for active campaigns
const activeCampaigns = [
  { 
    id: 3, 
    name: 'IT Security Campaign',
    template: 'System Update',
    startDate: '2024-05-01',
    endDate: '2024-05-15',
    targets: 120,
    clicks: 25,
    opens: 40,
    status: 'Active',
    analytics: {
      emailOpens: [
        { email: 'amy.lee@company.com', name: 'Amy Lee', department: 'Marketing', opened: true, clicked: true },
        { email: 'tom.davis@company.com', name: 'Tom Davis', department: 'IT', opened: true, clicked: false },
        { email: 'sarah.miller@company.com', name: 'Sarah Miller', department: 'Finance', opened: false, clicked: false },
      ]
    }
  },
];

const Campaigns = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const filteredTemplates = searchTerm
    ? templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : templates;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Phishing Campaigns</h1>
              <p className="text-gray-600">Create and manage security awareness campaigns</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#907527] hover:bg-[#705b1e] mt-4 md:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <CampaignForm onClose={() => {}} onCreate={() => {
                  toast({
                    title: "Campaign Created",
                    description: "Your new campaign has been created successfully"
                  });
                }} />
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Campaigns</TabsTrigger>
              <TabsTrigger value="completed">Completed Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-6">
              <CampaignList 
                campaigns={activeCampaigns}
                onSelectCampaign={setSelectedCampaign}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4 mt-6">
              <CampaignList 
                campaigns={completedCampaigns}
                onSelectCampaign={setSelectedCampaign}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Campaign Report: {selectedCampaign.name}</DialogTitle>
            </DialogHeader>
            <CampaignDetails campaign={selectedCampaign} />
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};

export default Campaigns;
