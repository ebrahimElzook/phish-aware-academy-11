
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
import { Video, Plus, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export const CampaignCreator = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [selectedTargetType, setSelectedTargetType] = React.useState<string>("all");
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  
  // Mock data for demonstration - in real app this would come from your backend
  const availableVideos = [
    { id: '1', title: 'Password Security Basics' },
    { id: '2', title: 'Social Engineering Awareness' },
    { id: '3', title: 'Data Protection 101' },
  ];

  // Mock departments data
  const departments = [
    { id: 'd1', name: 'IT' },
    { id: 'd2', name: 'HR' },
    { id: 'd3', name: 'Finance' },
    { id: 'd4', name: 'Marketing' },
    { id: 'd5', name: 'Operations' },
  ];

  const handleCreateCampaign = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both start and end dates for the campaign.",
        variant: "destructive",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Campaign Created",
      description: "Your new training campaign has been created successfully.",
    });
  };

  const handleTargetTypeChange = (value: string) => {
    setSelectedTargetType(value);
    if (value === "all") {
      setSelectedDepartments([]);
    }
  };

  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
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
            <Label>Target Audience</Label>
            <Select 
              value={selectedTargetType} 
              onValueChange={handleTargetTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="departments">Specific Departments</SelectItem>
                <SelectItem value="custom">Custom User Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedTargetType === "departments" && (
            <div className="grid gap-2 border p-3 rounded-md">
              <Label>Select Departments</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {departments.map(dept => (
                  <div key={dept.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={dept.id} 
                      checked={selectedDepartments.includes(dept.id)}
                      onCheckedChange={() => toggleDepartment(dept.id)}
                    />
                    <Label htmlFor={dept.id} className="text-sm font-normal">{dept.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedTargetType === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor="userSearch">Search Users</Label>
              <div className="flex items-center space-x-2">
                <Input id="userSearch" placeholder="Search by name or email" />
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Use the advanced user selector to choose specific users
              </div>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  fromDate={startDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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

