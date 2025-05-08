
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, UsersRound, Mail, Upload } from 'lucide-react';

export const UserIntegrations = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [connecting, setConnecting] = useState(false);

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
          <TabsList className="grid w-full grid-cols-3">
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
            <Button 
              onClick={handleConnectO365} 
              disabled={connecting}
              className="bg-[#907527] hover:bg-[#705b1e]"
            >
              {connecting ? "Connecting..." : "Connect to Microsoft 365"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
