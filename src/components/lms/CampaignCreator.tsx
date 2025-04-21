
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CampaignCreator = () => {
  const { toast } = useToast();
  
  // Mock data for demonstration - in real app this would come from your backend
  const availableVideos = [
    { id: '1', title: 'Password Security Basics' },
    { id: '2', title: 'Social Engineering Awareness' },
    { id: '3', title: 'Data Protection 101' },
  ];

  const handleCreateCampaign = () => {
    toast({
      title: "Campaign Created",
      description: "Your new training campaign has been created successfully.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Create New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Training Campaign</DialogTitle>
          <DialogDescription>
            Set up a new training campaign and select the videos to include.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input id="name" placeholder="Enter campaign name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input id="audience" placeholder="e.g., IT Department, All Employees" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="videos">Select Videos</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose videos to include" />
              </SelectTrigger>
              <SelectContent>
                {availableVideos.map((video) => (
                  <SelectItem key={video.id} value={video.id}>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {video.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateCampaign}>Create Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
