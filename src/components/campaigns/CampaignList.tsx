
import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card } from "@/components/ui/card";
import { Mail, Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface Campaign {
  id: number;
  name: string;
  template: string;
  startDate: string;
  endDate: string;
  targets: number;
  clicks: number;
  opens: number;
  status: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onSelectCampaign }) => {
  if (campaigns.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <Mail className="h-12 w-12 text-gray-300" />
          <h3 className="text-xl font-medium mt-2">No campaigns found</h3>
          <p className="text-gray-500">Create a new campaign to start raising security awareness</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#907527] hover:bg-[#705b1e] mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign Name</TableHead>
          <TableHead>Template</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Targets</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map(campaign => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>{campaign.template}</TableCell>
            <TableCell>{campaign.startDate}</TableCell>
            <TableCell>{campaign.endDate}</TableCell>
            <TableCell>{campaign.targets}</TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => onSelectCampaign(campaign)}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Report
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CampaignList;
