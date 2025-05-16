
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, UserPlus, Upload, Check, UserRound } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const UserManualEntry = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  
  // Mock data for demonstration
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Ahmed Mohammed', email: 'ahmed@example.com', department: 'IT' },
    { id: 'u2', name: 'Sarah Ali', email: 'sara@example.com', department: 'HR' },
    { id: 'u3', name: 'Mohammed Khalid', email: 'mohammed@example.com', department: 'Finance' },
  ]);

  const [departments, setDepartments] = useState(['IT', 'HR', 'Finance', 'Marketing', 'Operations']);

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
      title: "File upload started",
      description: `Uploading ${file.name}. This may take a moment.`,
    });

    // Simulate upload process
    setTimeout(() => {
      // Add sample users to demonstrate
      const newUsers = [
        { id: 'u4', name: 'Omar Said', email: 'omar@example.com', department: 'Marketing' },
        { id: 'u5', name: 'Fatima Ahmed', email: 'fatima@example.com', department: 'HR' },
      ];
      
      setUsers([...users, ...newUsers]);
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded and users added successfully.`,
      });
      setFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 2000);
  };

  const handleAddUser = () => {
    if (!name || !email || !department) {
      toast({
        title: "Incomplete information",
        description: "Please enter all required information",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: `u${Math.random().toString(16).slice(2)}`,
      name,
      email,
      department
    };

    setUsers([...users, newUser]);
    
    toast({
      title: "User added",
      description: "User has been added successfully",
    });

    // Clear form
    setName('');
    setEmail('');
    setDepartment('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-[#907527]" />
          Add Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Import from Excel</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 py-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Employee Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter employee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handleAddUser}
              className="bg-[#907527] hover:bg-[#705b1e]"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </TabsContent>
          
          <TabsContent value="excel" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="excel-upload">Upload Excel File with Users</Label>
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
                    <span>Email Address</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Name</span>
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
        </Tabs>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">User List</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
