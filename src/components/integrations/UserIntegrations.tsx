
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, UsersRound, Mail, Upload, Check, UserRound } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export const UserIntegrations = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [departments, setDepartments] = useState(['IT', 'HR', 'Finance', 'Marketing', 'Operations']);
  
  // Mock data for demonstration
  const mockUsers = [
    { id: 'u1', name: 'John Doe', email: 'john@example.com', department: 'IT' },
    { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', department: 'HR' },
    { id: 'u3', name: 'Robert Johnson', email: 'robert@example.com', department: 'Finance' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to upload",
        variant: "destructive",
      });
      return;
    }

    // Here you would handle the actual file upload to your backend
    toast({
      title: "File Upload Started",
      description: `Uploading ${file.name}. This may take a moment.`,
    });

    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${file.name} with user data.`,
      });
      setFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 2000);
  };

  const handleConnectAD = () => {
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      toast({
        title: "Integration Successful",
        description: "Successfully connected to Active Directory.",
      });
      setConnecting(false);
    }, 2000);
  };

  const handleConnectO365 = () => {
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      toast({
        title: "Integration Successful",
        description: "Successfully connected to Microsoft 365.",
      });
      setConnecting(false);
    }, 2000);
  };

  const handleAddDepartment = () => {
    const newDept = document.getElementById('new-department') as HTMLInputElement;
    if (newDept && newDept.value) {
      if (!departments.includes(newDept.value)) {
        setDepartments([...departments, newDept.value]);
        toast({
          title: "Department Added",
          description: `Added ${newDept.value} to departments list.`,
        });
        newDept.value = '';
      } else {
        toast({
          title: "Department Exists",
          description: "This department already exists in the list.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-[#907527]" />
          User Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="excel" className="flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel Import</span>
            </TabsTrigger>
            <TabsTrigger value="ad" className="flex items-center gap-1">
              <UsersRound className="h-4 w-4" />
              <span>Active Directory</span>
            </TabsTrigger>
            <TabsTrigger value="o365" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>Microsoft 365</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-1">
              <UserRound className="h-4 w-4" />
              <span>Departments</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="excel" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="excel-upload">Upload User Excel Sheet</Label>
              <div className="grid gap-2">
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
                <div className="text-xs text-gray-500">
                  Accepted formats: .xlsx, .xls, .csv
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {file && (
                <div className="text-sm">
                  Selected: {file.name}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Required Columns</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>First Name</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Last Name</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Department</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleFileUpload}
              disabled={!file}
              className="bg-[#907527] hover:bg-[#705b1e]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Users
            </Button>
          </TabsContent>
          
          <TabsContent value="ad" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ad-domain">Active Directory Domain</Label>
              <Input id="ad-domain" placeholder="example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ad-username">Administrator Username</Label>
                <Input id="ad-username" placeholder="admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-password">Administrator Password</Label>
                <Input id="ad-password" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sync Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sync-users" defaultChecked />
                  <Label htmlFor="sync-users">Sync Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sync-groups" defaultChecked />
                  <Label htmlFor="sync-groups">Sync Groups as Departments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-sync" />
                  <Label htmlFor="auto-sync">Auto-sync Daily</Label>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleConnectAD} 
              disabled={connecting}
              className="bg-[#907527] hover:bg-[#705b1e]"
            >
              {connecting ? "Connecting..." : "Connect to Active Directory"}
            </Button>
          </TabsContent>
          
          <TabsContent value="o365" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="o365-tenant">Microsoft 365 Tenant ID</Label>
              <Input id="o365-tenant" placeholder="organization.onmicrosoft.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="o365-client-id">Client ID</Label>
                <Input id="o365-client-id" placeholder="client-id" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="o365-client-secret">Client Secret</Label>
                <Input id="o365-client-secret" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sync Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sync-m365-users" defaultChecked />
                  <Label htmlFor="sync-m365-users">Sync User Accounts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sync-m365-groups" defaultChecked />
                  <Label htmlFor="sync-m365-groups">Sync Microsoft 365 Groups</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sync-m365-teams" />
                  <Label htmlFor="sync-m365-teams">Sync Teams as Departments</Label>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleConnectO365} 
              disabled={connecting}
              className="bg-[#907527] hover:bg-[#705b1e]"
            >
              {connecting ? "Connecting..." : "Connect to Microsoft 365"}
            </Button>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Manage Departments</Label>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <Input id="new-department" placeholder="Enter new department name" />
                  <Button 
                    onClick={handleAddDepartment}
                    className="bg-[#907527] hover:bg-[#705b1e]"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <Label className="block mb-2">Current Departments</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {departments.map((dept, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                    <span>{dept}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border rounded-md p-4">
              <Label className="block mb-2">Sample Users</Label>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div key={user.id} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-sm bg-gray-200 px-2 py-1 rounded">
                      {user.department}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

