
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
import { Video, Plus, Calendar, Users, Award, ArrowRight } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CertificatePreview from './CertificatePreview';

export const CampaignCreator = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [selectedTargetType, setSelectedTargetType] = React.useState<string>("all");
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  const [enableCertificate, setEnableCertificate] = React.useState<boolean>(true);
  const [certificateTitle, setCertificateTitle] = React.useState<string>("Security Awareness Training");
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  
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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Create New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Training Campaign</DialogTitle>
          <DialogDescription>
            Set up a new training campaign and select the videos to include.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of 3</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step} 
                  className={cn(
                    "h-2 w-6 rounded-full", 
                    currentStep >= step ? "bg-blue-500" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {currentStep === 1 && (
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
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid gap-4 py-4">
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
        )}

        {currentStep === 3 && (
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id="enableCertificate" 
                checked={enableCertificate}
                onCheckedChange={(checked) => setEnableCertificate(checked === true)}
              />
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <Label htmlFor="enableCertificate" className="font-medium">Enable Completion Certificates</Label>
              </div>
            </div>
            
            {enableCertificate && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="certificateTitle">Certificate Title</Label>
                  <Input 
                    id="certificateTitle" 
                    value={certificateTitle}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                    placeholder="Enter certificate title" 
                  />
                </div>
                
                <Tabs defaultValue="preview">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="preview">Certificate Preview</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="mt-4">
                    <CertificatePreview courseName={certificateTitle} />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-4 space-y-4">
                    <div className="grid gap-2">
                      <Label>Automatic Distribution</Label>
                      <Select defaultValue="immediately">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">Immediately on completion</SelectItem>
                          <SelectItem value="daily">Daily batch</SelectItem>
                          <SelectItem value="weekly">Weekly batch</SelectItem>
                          <SelectItem value="manual">Manual distribution only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="emailCertificate" defaultChecked />
                      <Label htmlFor="emailCertificate">Email certificate to users</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="allowDownload" defaultChecked />
                      <Label htmlFor="allowDownload">Allow users to download certificate</Label>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between mt-6">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 3 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

