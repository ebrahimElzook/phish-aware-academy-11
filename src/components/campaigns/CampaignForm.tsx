
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, X, Calendar as CalendarIcon, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock data for campaign templates
const templates = [
  { id: 1, name: 'Password Reset', category: 'IT', difficulty: 'Medium' },
  { id: 2, name: 'Bonus Payment', category: 'HR', difficulty: 'Easy' },
  { id: 3, name: 'System Update', category: 'IT', difficulty: 'Hard' },
  { id: 4, name: 'Office Move', category: 'Admin', difficulty: 'Medium' },
];

// Mock departments data
const departments = [
  { id: 'd1', name: 'IT' },
  { id: 'd2', name: 'HR' },
  { id: 'd3', name: 'Finance' },
  { id: 'd4', name: 'Marketing' },
  { id: 'd5', name: 'Operations' },
];

// Mock employees data
const employees = [
  { id: 'e1', name: 'John Doe', email: 'john.doe@company.com', department: 'IT' },
  { id: 'e2', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Marketing' },
  { id: 'e3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'HR' },
  { id: 'e4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Finance' },
  { id: 'e5', name: 'Robert Brown', email: 'robert.brown@company.com', department: 'IT' },
  { id: 'e6', name: 'Lisa Taylor', email: 'lisa.taylor@company.com', department: 'Operations' },
];

interface CampaignFormProps {
  onClose: () => void;
  onCreate: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onClose, onCreate }) => {
  const { toast } = useToast();
  const [targetType, setTargetType] = useState('all');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<typeof employees>([]);
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const filteredEmployees = employees.filter(emp => 
    !selectedEmployees.find(selected => selected.id === emp.id) &&
    (emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
     emp.email.toLowerCase().includes(employeeSearch.toLowerCase()))
  );

  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };
  
  const addEmployee = (employee: typeof employees[0]) => {
    setSelectedEmployees(prev => [...prev, employee]);
    setEmployeeSearch('');
  };
  
  const removeEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const handleCreateCampaign = () => {
    if (!campaignName || !selectedTemplate || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (targetType === 'departments' && selectedDepartments.length === 0) {
      toast({
        title: "No Departments Selected",
        description: "Please select at least one department",
        variant: "destructive"
      });
      return;
    }
    
    if (targetType === 'specific' && selectedEmployees.length === 0) {
      toast({
        title: "No Employees Selected",
        description: "Please select at least one employee",
        variant: "destructive"
      });
      return;
    }
    
    if (endDate < startDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }
    
    onCreate();
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign Name</Label>
        <Input 
          id="campaign-name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Enter campaign name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="campaign-template">Template</Label>
        <Select 
          value={selectedTemplate} 
          onValueChange={(value) => setSelectedTemplate(value)}
        >
          <SelectTrigger id="campaign-template">
            <SelectValue placeholder="Select campaign template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.name}>
                {template.name} - {template.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                fromDate={startDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>Target Audience</Label>
        <Tabs defaultValue={targetType} onValueChange={setTargetType}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="specific">Specific Employees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <p className="text-sm text-gray-500">
              This campaign will target all employees in the company.
            </p>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="border p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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
          </TabsContent>
          
          <TabsContent value="specific">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  placeholder="Search employees by name or email"
                  className="flex-1"
                />
                <Button variant="outline" disabled={!employeeSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {employeeSearch && filteredEmployees.length > 0 && (
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  <ul className="divide-y">
                    {filteredEmployees.map(emp => (
                      <li 
                        key={emp.id} 
                        className="p-2 hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => addEmployee(emp)}
                      >
                        <div>
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.email} - {emp.department}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {employeeSearch && filteredEmployees.length === 0 && (
                <p className="text-sm text-gray-500 py-2">No matching employees found</p>
              )}
              
              {selectedEmployees.length > 0 && (
                <div>
                  <Label className="block mb-2">Selected Employees ({selectedEmployees.length})</Label>
                  <div className="border rounded-md p-2 space-y-1 max-h-48 overflow-y-auto">
                    {selectedEmployees.map(emp => (
                      <div key={emp.id} className="flex justify-between items-center bg-gray-50 rounded-md p-2">
                        <div>
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.email} - {emp.department}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeEmployee(emp.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button 
          onClick={handleCreateCampaign}
          className="bg-[#907527] hover:bg-[#705b1e]"
        >
          Create Campaign
        </Button>
      </DialogFooter>
    </div>
  );
};

export default CampaignForm;
