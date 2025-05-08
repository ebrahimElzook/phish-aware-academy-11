
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIntegrations } from '@/components/integrations/UserIntegrations';
import { UserAccessControl } from '@/components/admin/UserAccessControl';
import { Toaster } from '@/components/ui/toaster';

const UserManagement = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      
      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="integrations">User Integrations</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations">
          <UserIntegrations />
        </TabsContent>
        
        <TabsContent value="access">
          <UserAccessControl />
        </TabsContent>
      </Tabs>
      
      <Toaster />
    </div>
  );
};

export default UserManagement;
