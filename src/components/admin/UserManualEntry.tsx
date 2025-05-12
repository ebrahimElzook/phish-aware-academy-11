
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
    { id: 'u1', name: 'أحمد محمد', email: 'ahmed@example.com', department: 'تكنولوجيا المعلومات' },
    { id: 'u2', name: 'سارة علي', email: 'sara@example.com', department: 'الموارد البشرية' },
    { id: 'u3', name: 'محمد خالد', email: 'mohammed@example.com', department: 'المالية' },
  ]);

  const [departments, setDepartments] = useState(['تكنولوجيا المعلومات', 'الموارد البشرية', 'المالية', 'التسويق', 'العمليات']);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      toast({
        title: "لم يتم اختيار ملف",
        description: "الرجاء اختيار ملف Excel لرفعه",
        variant: "destructive",
      });
      return;
    }

    // Here you would handle the actual file upload to your backend
    toast({
      title: "بدأ رفع الملف",
      description: `جاري رفع ${file.name}. قد يستغرق هذا بعض الوقت.`,
    });

    // Simulate upload process
    setTimeout(() => {
      // Add sample users to demonstrate
      const newUsers = [
        { id: 'u4', name: 'عمر سعيد', email: 'omar@example.com', department: 'التسويق' },
        { id: 'u5', name: 'فاطمة أحمد', email: 'fatima@example.com', department: 'الموارد البشرية' },
      ];
      
      setUsers([...users, ...newUsers]);
      
      toast({
        title: "تم الرفع بنجاح",
        description: `تم رفع ${file.name} وإضافة المستخدمين بنجاح.`,
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
        title: "معلومات غير مكتملة",
        description: "الرجاء إدخال جميع المعلومات المطلوبة",
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
      title: "تمت الإضافة بنجاح",
      description: "تم إضافة المستخدم بنجاح",
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
          إضافة المستخدمين
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>إضافة يدوية</span>
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>استيراد من Excel</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 py-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الموظف</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ادخل اسم الموظف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ادخل البريد الإلكتروني"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">القسم</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
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
              إضافة المستخدم
            </Button>
          </TabsContent>
          
          <TabsContent value="excel" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="excel-upload">رفع ملف Excel للمستخدمين</Label>
              <div className="grid gap-2">
                <Input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
                <div className="text-xs text-gray-500">
                  الصيغ المقبولة: .xlsx, .xls, .csv
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {file && (
                <div className="text-sm">
                  تم اختيار: {file.name}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الأعمدة المطلوبة</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>البريد الإلكتروني</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>الاسم</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>القسم</span>
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
              رفع المستخدمين
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">قائمة المستخدمين</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>القسم</TableHead>
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
