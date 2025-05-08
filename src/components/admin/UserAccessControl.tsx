
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserRound, UserPlus, UserMinus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  department: string;
  status: 'active' | 'inactive' | 'pending';
}

export const UserAccessControl: React.FC = () => {
  const { toast } = useToast();
  // Mock data for demonstration
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'admin', 
      department: 'IT', 
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'user', 
      department: 'Marketing', 
      status: 'active' 
    },
    { 
      id: '3', 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      role: 'manager', 
      department: 'Finance', 
      status: 'pending' 
    },
    { 
      id: '4', 
      name: 'Emily Williams', 
      email: 'emily@example.com', 
      role: 'user', 
      department: 'HR', 
      status: 'inactive' 
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'manager',
    department: 'IT',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Legal'];

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const id = Math.random().toString(36).substring(7);
    const user: User = {
      id,
      ...newUser
    };

    setUsers([...users, user]);
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    });

    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      department: 'IT',
      status: 'active'
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));

    toast({
      title: "User Updated",
      description: `${editingUser.name}'s information has been updated.`,
    });

    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Removed",
      description: "The user has been removed from the system.",
    });
  };

  const handleStatusChange = (userId: string, status: 'active' | 'inactive' | 'pending') => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, status} : user
    ));

    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    
    toast({
      title: `User ${statusText}`,
      description: `User status has been updated to ${status}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-[#907527]" />
          User Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">User List</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#907527] hover:bg-[#705b1e]">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select 
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({
                        ...newUser, 
                        role: value as 'admin' | 'user' | 'manager'
                      })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      value={newUser.department}
                      onValueChange={(value) => setNewUser({...newUser, department: value})}
                    >
                      <SelectTrigger className="col-span-3">
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
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleAddUser}
                    className="bg-[#907527] hover:bg-[#705b1e]"
                  >
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        {editingUser && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-role" className="text-right">
                                Role
                              </Label>
                              <Select 
                                value={editingUser.role}
                                onValueChange={(value) => setEditingUser({
                                  ...editingUser, 
                                  role: value as 'admin' | 'user' | 'manager'
                                })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-department" className="text-right">
                                Department
                              </Label>
                              <Select
                                value={editingUser.department}
                                onValueChange={(value) => setEditingUser({...editingUser, department: value})}
                              >
                                <SelectTrigger className="col-span-3">
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
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-status" className="text-right">
                                Status
                              </Label>
                              <Select
                                value={editingUser.status}
                                onValueChange={(value) => setEditingUser({
                                  ...editingUser, 
                                  status: value as 'active' | 'inactive' | 'pending'
                                })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button 
                            onClick={handleUpdateUser}
                            className="bg-[#907527] hover:bg-[#705b1e]"
                          >
                            Update
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>

                    {user.status !== 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={() => handleStatusChange(user.id, 'active')}
                      >
                        Activate
                      </Button>
                    )}
                    
                    {user.status !== 'inactive' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => handleStatusChange(user.id, 'inactive')}
                      >
                        Deactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
