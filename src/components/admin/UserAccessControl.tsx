
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Search, Check, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
}

export const UserAccessControl: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for demonstration
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'Ahmed Mohammed', 
      email: 'ahmed@example.com', 
      department: 'IT', 
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'Sarah Ali', 
      email: 'sara@example.com', 
      department: 'HR', 
      status: 'active' 
    },
    { 
      id: '3', 
      name: 'Mohammed Khalid', 
      email: 'mohammed@example.com', 
      department: 'Finance', 
      status: 'active' 
    },
    { 
      id: '4', 
      name: 'Omar Said', 
      email: 'omar@example.com', 
      department: 'Marketing', 
      status: 'inactive' 
    },
  ]);

  const handleStatusChange = (userId: string, status: 'active' | 'inactive') => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, status} : user
    ));

    const statusText = status === 'active' ? 'activated' : 'deactivated';
    const userName = users.find(user => user.id === userId)?.name;
    
    toast({
      title: `User ${statusText}`,
      description: `${userName} has been ${statusText} successfully.`,
    });
  };

  // Filter users based on search term
  const filteredUsers = searchTerm 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#907527]" />
          Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search for user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => handleStatusChange(user.id, 'inactive')}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={() => handleStatusChange(user.id, 'active')}
                      >
                        Activate
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
