
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
import { Video, Plus, Calendar, Users, Award, ArrowRight, Edit } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

export const CampaignCreator = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [selectedTargetType, setSelectedTargetType] = React.useState<string>("all");
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  const [enableCertificate, setEnableCertificate] = React.useState<boolean>(true);
  const [certificateTitle, setCertificateTitle] = React.useState<string>("Security Awareness Training");
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [selectedVideos, setSelectedVideos] = React.useState<string[]>([]);
  const [videoQuestions, setVideoQuestions] = React.useState<{[key: string]: Question[]}>({});
  const [editingVideo, setEditingVideo] = React.useState<string | null>(null);
  
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

  // Interface for MCQ questions
  interface Question {
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
    }[];
  }

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

  const handleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
    
    // Initialize questions for this video if not already done
    if (!videoQuestions[videoId]) {
      setVideoQuestions(prev => ({
        ...prev,
        [videoId]: []
      }));
    }
  };

  const addQuestionToVideo = (videoId: string) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      text: '',
      options: [
        { id: `o1-${Date.now()}`, text: '', isCorrect: false },
        { id: `o2-${Date.now()}`, text: '', isCorrect: false },
        { id: `o3-${Date.now()}`, text: '', isCorrect: false },
        { id: `o4-${Date.now()}`, text: '', isCorrect: false }
      ]
    };

    setVideoQuestions(prev => ({
      ...prev,
      [videoId]: [...(prev[videoId] || []), newQuestion]
    }));
  };

  const updateQuestionText = (videoId: string, questionId: string, text: string) => {
    setVideoQuestions(prev => ({
      ...prev,
      [videoId]: prev[videoId].map(q => 
        q.id === questionId ? { ...q, text } : q
      )
    }));
  };

  const updateOptionText = (videoId: string, questionId: string, optionId: string, text: string) => {
    setVideoQuestions(prev => ({
      ...prev,
      [videoId]: prev[videoId].map(q => 
        q.id === questionId ? {
          ...q,
          options: q.options.map(o => 
            o.id === optionId ? { ...o, text } : o
          )
        } : q
      )
    }));
  };

  const setCorrectOption = (videoId: string, questionId: string, optionId: string) => {
    setVideoQuestions(prev => ({
      ...prev,
      [videoId]: prev[videoId].map(q => 
        q.id === questionId ? {
          ...q,
          options: q.options.map(o => ({
            ...o,
            isCorrect: o.id === optionId
          }))
        } : q
      )
    }));
  };

  const removeQuestion = (videoId: string, questionId: string) => {
    setVideoQuestions(prev => ({
      ...prev,
      [videoId]: prev[videoId].filter(q => q.id !== questionId)
    }));
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
      <DialogContent className="sm:max-w-[600px]">
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
              <div className="border rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
                {availableVideos.map((video) => (
                  <div key={video.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`video-${video.id}`} 
                          checked={selectedVideos.includes(video.id)}
                          onCheckedChange={() => handleVideoSelection(video.id)}
                        />
                        <Label htmlFor={`video-${video.id}`} className="text-sm font-normal flex items-center">
                          <Video className="h-4 w-4 mr-2" />
                          {video.title}
                        </Label>
                      </div>
                      
                      {selectedVideos.includes(video.id) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingVideo(editingVideo === video.id ? null : video.id)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          {videoQuestions[video.id]?.length ? 
                            `Questions (${videoQuestions[video.id].length})` : 
                            "Add Questions"}
                        </Button>
                      )}
                    </div>
                    
                    {editingVideo === video.id && (
                      <div className="pl-6 border-l-2 border-gray-200 space-y-4 mt-2">
                        {videoQuestions[video.id]?.map((question, qIndex) => (
                          <div key={question.id} className="space-y-2 bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <Label className="font-medium">Question {qIndex + 1}</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeQuestion(video.id, question.id)}
                              >
                                Remove
                              </Button>
                            </div>
                            
                            <Textarea 
                              value={question.text}
                              onChange={(e) => updateQuestionText(video.id, question.id, e.target.value)}
                              placeholder="Enter question text"
                              className="min-h-[60px]"
                            />
                            
                            <div className="space-y-2">
                              <Label className="text-sm">Answer Options</Label>
                              {question.options.map((option, index) => (
                                <div key={option.id} className="flex items-center gap-2">
                                  <div className="flex-1 flex items-center gap-2">
                                    <Checkbox 
                                      checked={option.isCorrect}
                                      onCheckedChange={() => setCorrectOption(video.id, question.id, option.id)}
                                    />
                                    <Input 
                                      value={option.text}
                                      onChange={(e) => updateOptionText(video.id, question.id, option.id, e.target.value)}
                                      placeholder={`Option ${index + 1}`}
                                    />
                                  </div>
                                </div>
                              ))}
                              <div className="text-xs text-muted-foreground">
                                Check the box next to the correct answer
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => addQuestionToVideo(video.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add New Question
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
