
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIntegrations } from '@/components/integrations/UserIntegrations';
import { UserAccessControl } from '@/components/admin/UserAccessControl';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserManualEntry } from '@/components/admin/UserManualEntry';
import { UserDepartments } from '@/components/admin/UserDepartments';
import { FileText, Users, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>إضافة المستخدمين</span>
              </TabsTrigger>
              <TabsTrigger value="departments" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>الإدارات</span>
              </TabsTrigger>
              <TabsTrigger value="access" className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                <span>التحكم بالصلاحيات</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserManualEntry />
            </TabsContent>
            
            <TabsContent value="departments">
              <UserDepartments />
            </TabsContent>
            
            <TabsContent value="access">
              <UserAccessControl />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default UserManagement;
