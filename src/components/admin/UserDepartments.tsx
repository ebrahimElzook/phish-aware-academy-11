
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Users, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}

export const UserDepartments = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState(['تكنولوجيا المعلومات', 'الموارد البشرية', 'المالية', 'التسويق', 'العمليات']);
  const [newDepartment, setNewDepartment] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [movingUser, setMovingUser] = useState<User | null>(null);
  const [targetDepartment, setTargetDepartment] = useState('');
  
  // Mock data for demonstration
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'أحمد محمد', email: 'ahmed@example.com', department: 'تكنولوجيا المعلومات' },
    { id: 'u2', name: 'سارة علي', email: 'sara@example.com', department: 'الموارد البشرية' },
    { id: 'u3', name: 'محمد خالد', email: 'mohammed@example.com', department: 'المالية' },
    { id: 'u4', name: 'عمر سعيد', email: 'omar@example.com', department: 'التسويق' },
    { id: 'u5', name: 'فاطمة أحمد', email: 'fatima@example.com', department: 'الموارد البشرية' },
  ]);

  const handleAddDepartment = () => {
    if (!newDepartment) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم القسم",
        variant: "destructive",
      });
      return;
    }

    if (departments.includes(newDepartment)) {
      toast({
        title: "خطأ",
        description: "هذا القسم موجود بالفعل",
        variant: "destructive",
      });
      return;
    }

    setDepartments([...departments, newDepartment]);
    setNewDepartment('');
    
    toast({
      title: "تمت الإضافة بنجاح",
      description: `تم إضافة قسم ${newDepartment} بنجاح`,
    });
  };

  const handleDeleteDepartment = (dept: string) => {
    // Check if there are users in this department
    const usersInDept = users.filter(user => user.department === dept);
    
    if (usersInDept.length > 0) {
      toast({
        title: "لا يمكن الحذف",
        description: "لا يمكن حذف قسم يحتوي على مستخدمين. قم بنقل المستخدمين أولاً.",
        variant: "destructive",
      });
      return;
    }
    
    setDepartments(departments.filter(d => d !== dept));
    toast({
      title: "تم الحذف بنجاح",
      description: `تم حذف قسم ${dept} بنجاح`,
    });
  };

  const handleMoveUser = () => {
    if (!movingUser || !targetDepartment) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد المستخدم والقسم الهدف",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => {
      if (user.id === movingUser.id) {
        return { ...user, department: targetDepartment };
      }
      return user;
    }));

    toast({
      title: "تم النقل بنجاح",
      description: `تم نقل ${movingUser.name} إلى قسم ${targetDepartment} بنجاح`,
    });
    
    setMovingUser(null);
    setTargetDepartment('');
  };

  // Filter users by selected department
  const filteredUsers = selectedDepartment 
    ? users.filter(user => user.department === selectedDepartment)
    : users;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#907527]" />
          إدارة الأقسام
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">إضافة قسم جديد</h3>
            <div className="flex items-center gap-2">
              <Input
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="اسم القسم"
              />
              <Button 
                onClick={handleAddDepartment}
                className="bg-[#907527] hover:bg-[#705b1e]"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">الأقسام الحالية</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departments.map((dept, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded flex items-center justify-between">
                  <span>{dept}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteDepartment(dept)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">المستخدمون حسب القسم</h3>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="filter-department">تصفية حسب القسم:</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="جميع الأقسام" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الأقسام</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setMovingUser(user)}
                          >
                            نقل
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>نقل المستخدم إلى قسم آخر</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="mb-4">
                              نقل <span className="font-bold">{movingUser?.name}</span> من قسم <span className="font-bold">{movingUser?.department}</span>
                            </p>
                            <div className="space-y-2">
                              <Label htmlFor="target-department">القسم الجديد</Label>
                              <Select value={targetDepartment} onValueChange={setTargetDepartment}>
                                <SelectTrigger id="target-department">
                                  <SelectValue placeholder="اختر القسم" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.filter(d => d !== movingUser?.department).map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                      {dept}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">إلغاء</Button>
                            </DialogClose>
                            <Button 
                              onClick={handleMoveUser}
                              className="bg-[#907527] hover:bg-[#705b1e]"
                            >
                              تأكيد النقل
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
