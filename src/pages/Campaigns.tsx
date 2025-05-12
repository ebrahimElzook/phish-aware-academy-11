
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { BarChart, Calendar, FileText, Mail, Plus, Search, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data for campaign templates
const templates = [
  { id: 1, name: 'Password Reset', category: 'IT', difficulty: 'متوسط' },
  { id: 2, name: 'Bonus Payment', category: 'HR', difficulty: 'سهل' },
  { id: 3, name: 'System Update', category: 'IT', difficulty: 'صعب' },
  { id: 4, name: 'Office Move', category: 'Admin', difficulty: 'متوسط' },
];

// Mock data for completed campaigns
const completedCampaigns = [
  { 
    id: 1, 
    name: 'Password Security Campaign',
    template: 'Password Reset',
    startDate: '2024-04-10',
    endDate: '2024-04-20',
    targets: 85,
    clicks: 17,
    reports: 32,
    status: 'مكتمل'
  },
  { 
    id: 2, 
    name: 'HR Document Verification',
    template: 'Bonus Payment',
    startDate: '2024-03-15',
    endDate: '2024-03-25',
    targets: 50,
    clicks: 10,
    reports: 28,
    status: 'مكتمل'
  },
];

// Mock data for active campaigns
const activeCampaigns = [
  { 
    id: 3, 
    name: 'IT Security Campaign',
    template: 'System Update',
    startDate: '2024-05-01',
    endDate: '2024-05-15',
    targets: 120,
    clicks: 25,
    reports: 40,
    status: 'نشط'
  },
];

const Campaigns = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template: '',
    startDate: '',
    endDate: '',
    targetDepartments: [] as string[],
  });
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const departments = ['تكنولوجيا المعلومات', 'الموارد البشرية', 'المالية', 'التسويق', 'العمليات'];

  const filteredTemplates = searchTerm
    ? templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : templates;
    
  const handleCampaignCreate = () => {
    if (!newCampaign.name || !newCampaign.template || !newCampaign.startDate || !newCampaign.endDate || newCampaign.targetDepartments.length === 0) {
      toast({
        title: "بيانات غير مكتملة",
        description: "الرجاء إدخال جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    toast({
      title: "تم إنشاء الحملة بنجاح",
      description: `تم بدء حملة "${newCampaign.name}" بنجاح`,
    });
    
    // Reset form
    setNewCampaign({
      name: '',
      template: '',
      startDate: '',
      endDate: '',
      targetDepartments: [],
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">حملات التصيد الإلكتروني</h1>
              <p className="text-gray-600">إنشاء وإدارة حملات التوعية الأمنية</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#907527] hover:bg-[#705b1e] mt-4 md:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  إنشاء حملة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>إنشاء حملة جديدة</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">اسم الحملة</Label>
                    <Input 
                      id="campaign-name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      placeholder="أدخل اسم الحملة"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="campaign-template">القالب</Label>
                    <Select 
                      value={newCampaign.template} 
                      onValueChange={(value) => setNewCampaign({...newCampaign, template: value})}
                    >
                      <SelectTrigger id="campaign-template">
                        <SelectValue placeholder="اختر قالب الحملة" />
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
                      <Label htmlFor="start-date">تاريخ البدء</Label>
                      <Input 
                        id="start-date"
                        type="date"
                        value={newCampaign.startDate}
                        onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">تاريخ الانتهاء</Label>
                      <Input 
                        id="end-date"
                        type="date"
                        value={newCampaign.endDate}
                        onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>الأقسام المستهدفة</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {departments.map((dept, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`dept-${index}`}
                            checked={newCampaign.targetDepartments.includes(dept)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCampaign({
                                  ...newCampaign, 
                                  targetDepartments: [...newCampaign.targetDepartments, dept]
                                });
                              } else {
                                setNewCampaign({
                                  ...newCampaign, 
                                  targetDepartments: newCampaign.targetDepartments.filter(d => d !== dept)
                                });
                              }
                            }}
                            className="h-4 w-4 border-gray-300 rounded text-[#907527] focus:ring-[#907527]"
                          />
                          <Label htmlFor={`dept-${index}`} className="mr-2">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">إلغاء</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleCampaignCreate}
                    className="bg-[#907527] hover:bg-[#705b1e]"
                  >
                    إنشاء الحملة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">الحملات النشطة</TabsTrigger>
              <TabsTrigger value="completed">الحملات المكتملة</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-6">
              {activeCampaigns.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الحملة</TableHead>
                      <TableHead>القالب</TableHead>
                      <TableHead>تاريخ البدء</TableHead>
                      <TableHead>تاريخ الانتهاء</TableHead>
                      <TableHead>المستهدفين</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCampaigns.map(campaign => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.template}</TableCell>
                        <TableCell>{campaign.startDate}</TableCell>
                        <TableCell>{campaign.endDate}</TableCell>
                        <TableCell>{campaign.targets}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                onClick={() => setSelectedCampaign(campaign)}
                              >
                                <BarChart className="h-4 w-4 mr-2" />
                                تقرير
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px]">
                              <DialogHeader>
                                <DialogTitle>تقرير الحملة: {selectedCampaign?.name}</DialogTitle>
                              </DialogHeader>
                              {selectedCampaign && (
                                <div className="mt-4 space-y-6">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Users className="h-4 w-4" />
                                        <span>المستهدفين</span>
                                      </div>
                                      <p className="text-2xl font-bold">{selectedCampaign.targets}</p>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Mail className="h-4 w-4" />
                                        <span>النقرات</span>
                                      </div>
                                      <p className="text-2xl font-bold text-red-600">{selectedCampaign.clicks}</p>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <FileText className="h-4 w-4" />
                                        <span>التقارير</span>
                                      </div>
                                      <p className="text-2xl font-bold text-green-600">{selectedCampaign.reports}</p>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>الحالة</span>
                                      </div>
                                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm inline-block">
                                        {selectedCampaign.status}
                                      </div>
                                    </Card>
                                  </div>
                                  
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>المقياس</TableHead>
                                        <TableHead>القيمة</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell>معدل النقر</TableCell>
                                        <TableCell>{Math.round((selectedCampaign.clicks / selectedCampaign.targets) * 100)}%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>معدل الإبلاغ</TableCell>
                                        <TableCell>{Math.round((selectedCampaign.reports / selectedCampaign.targets) * 100)}%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>تاريخ البدء</TableCell>
                                        <TableCell>{selectedCampaign.startDate}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>تاريخ الانتهاء</TableCell>
                                        <TableCell>{selectedCampaign.endDate}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="h-12 w-12 text-gray-300" />
                    <h3 className="text-xl font-medium mt-2">لا توجد حملات نشطة</h3>
                    <p className="text-gray-500">قم بإنشاء حملة جديدة للبدء في نشر التوعية الأمنية</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-[#907527] hover:bg-[#705b1e] mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          إنشاء حملة جديدة
                        </Button>
                      </DialogTrigger>
                      {/* Dialog content is the same as the one above */}
                    </Dialog>
                  </div>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedCampaigns.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الحملة</TableHead>
                      <TableHead>القالب</TableHead>
                      <TableHead>تاريخ البدء</TableHead>
                      <TableHead>تاريخ الانتهاء</TableHead>
                      <TableHead>المستهدفين</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedCampaigns.map(campaign => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.template}</TableCell>
                        <TableCell>{campaign.startDate}</TableCell>
                        <TableCell>{campaign.endDate}</TableCell>
                        <TableCell>{campaign.targets}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                onClick={() => setSelectedCampaign(campaign)}
                              >
                                <BarChart className="h-4 w-4 mr-2" />
                                تقرير
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px]">
                              <DialogHeader>
                                <DialogTitle>تقرير الحملة: {selectedCampaign?.name}</DialogTitle>
                              </DialogHeader>
                              {selectedCampaign && (
                                <div className="mt-4 space-y-6">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Users className="h-4 w-4" />
                                        <span>المستهدفين</span>
                                      </div>
                                      <p className="text-2xl font-bold">{selectedCampaign.targets}</p>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Mail className="h-4 w-4" />
                                        <span>النقرات</span>
                                      </div>
                                      <p className="text-2xl font-bold text-red-600">{selectedCampaign.clicks}</p>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <FileText className="h-4 w-4" />
                                        <span>التقارير</span>
                                      </div>
                                      <p className="text-2xl font-bold text-green-600">{selectedCampaign.reports}</p>
                                    </Card>
                                    <Card className="p-4">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>الحالة</span>
                                      </div>
                                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm inline-block">
                                        {selectedCampaign.status}
                                      </div>
                                    </Card>
                                  </div>
                                  
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>المقياس</TableHead>
                                        <TableHead>القيمة</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell>معدل النقر</TableCell>
                                        <TableCell>{Math.round((selectedCampaign.clicks / selectedCampaign.targets) * 100)}%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>معدل الإبلاغ</TableCell>
                                        <TableCell>{Math.round((selectedCampaign.reports / selectedCampaign.targets) * 100)}%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>تاريخ البدء</TableCell>
                                        <TableCell>{selectedCampaign.startDate}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>تاريخ الانتهاء</TableCell>
                                        <TableCell>{selectedCampaign.endDate}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-gray-300" />
                    <h3 className="text-xl font-medium mt-2">لا توجد حملات مكتملة</h3>
                    <p className="text-gray-500">ستظهر الحملات المكتملة هنا عند انتهاء الحملات النشطة</p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Campaigns;
