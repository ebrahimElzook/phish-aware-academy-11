
import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, Book, BookOpen, FileText, BarChart, Users, Mail, LogOut, User, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const { companySlug } = useParams<{ companySlug?: string }>();
  
  // Get user's display name and role
  const userName = user?.first_name || user?.username || '';
  const userRole = user?.role?.toLowerCase() || '';
  
  // Determine if the user is a regular user (not admin or company admin)
  const isRegularUser = userRole === 'user';
  
  // Determine if the user has admin privileges (admin, super_admin, or company_admin)
  const hasAdminPrivileges = ['admin', 'super_admin', 'company_admin'].includes(userRole);
  
  // Helper function to generate company-aware links
  const getLink = (path: string) => {
    if (companySlug) {
      return `/${companySlug}${path}`;
    }
    return path;
  };
  
  // Check if a path is active, considering company context
  const isActive = (path: string) => {
    if (companySlug) {
      // For company-specific routes, match the path after the company slug
      const companyPath = `/${companySlug}${path}`;
      return location.pathname === companyPath;
    }
    // For global routes, match the exact path
    return location.pathname === path;
  };
  
  // No need for useEffect here as the AuthContext handles authentication state
  
  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
  };
  
  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/876a553e-d478-4016-a8f0-1580f492ca19.png" alt="CSWORD Logo" className="h-10" />
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Only show Home link when not in a company context and has admin privileges */}
          {!companySlug && hasAdminPrivileges && (
            <Link to="/" className={`transition-colors ${isActive("/") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              Home
            </Link>
          )}
          
          {/* Only show these links for users with admin privileges */}
          {hasAdminPrivileges && (
            <>
              <Link to={getLink("/dashboard")} className={`transition-colors ${isActive("/dashboard") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                Dashboard
              </Link>
              <Link to={getLink("/templates")} className={`transition-colors ${isActive("/templates") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Templates</span>
                </div>
              </Link>
              <Link to={getLink("/campaigns")} className={`transition-colors ${isActive("/campaigns") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>Campaigns</span>
                </div>
              </Link>
              <Link to={getLink("/analytics")} className={`transition-colors ${isActive("/analytics") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>Analytics</span>
                </div>
              </Link>
              <Link to={getLink("/user-management")} className={`transition-colors ${isActive("/user-management") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </div>
              </Link>
              <Link to={getLink("/sender")} className={`transition-colors ${isActive("/sender") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                <div className="flex items-center gap-1">
                  <Send className="h-4 w-4" />
                  <span>Sender</span>
                </div>
              </Link>
            </>
          )}
          
          {/* Training link is shown only to admin users */}
          {hasAdminPrivileges && (
            <Link to={getLink("/lms-campaigns")} className={`transition-colors ${isActive("/lms-campaigns") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Training</span>
              </div>
            </Link>
          )}
          
          {/* Employee Courses link is shown to all users */}
          <Link to={getLink("/employee-courses")} className={`transition-colors ${isActive("/employee-courses") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            <div className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span>My Courses</span>
            </div>
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to={getLink("/profile-settings")}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={companySlug ? `/${companySlug}/login` : "/select-company"}>
              <Button variant="default" className="bg-[#907527] hover:bg-[#705b1e]">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 py-2 px-4 animate-in">
          <div className="flex flex-col gap-4">
            {/* Only show Home link when not in a company context and has admin privileges */}
            {!companySlug && hasAdminPrivileges && (
              <Link to="/" className={`transition-colors py-2 ${isActive("/") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                Home
              </Link>
            )}
            
            {/* Only show these links for users with admin privileges */}
            {hasAdminPrivileges && (
              <>
                <Link to={getLink("/dashboard")} className={`transition-colors py-2 ${isActive("/dashboard") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                  Dashboard
                </Link>
                <Link to={getLink("/templates")} className={`transition-colors py-2 ${isActive("/templates") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Templates</span>
                  </div>
                </Link>
                <Link to={getLink("/campaigns")} className={`transition-colors py-2 ${isActive("/campaigns") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>Campaigns</span>
                  </div>
                </Link>
                <Link to={getLink("/analytics")} className={`transition-colors py-2 ${isActive("/analytics") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                  <div className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span>Analytics</span>
                  </div>
                </Link>
                <Link to={getLink("/user-management")} className={`transition-colors py-2 ${isActive("/user-management") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </div>
                </Link>
                <Link to={getLink("/sender")} className={`transition-colors py-2 ${isActive("/sender") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                  <div className="flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    <span>Sender</span>
                  </div>
                </Link>
              </>
            )}
            
            {/* Training link is shown only to admin users */}
            {hasAdminPrivileges && (
              <Link to={getLink("/lms-campaigns")} className={`transition-colors py-2 ${isActive("/lms-campaigns") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Training</span>
                </div>
              </Link>
            )}
            
            {/* Employee Courses link is shown to all users */}
            <Link to={getLink("/employee-courses")} className={`transition-colors py-2 ${isActive("/employee-courses") ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                <span>My Courses</span>
              </div>
            </Link>
            
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link to={getLink("/profile-settings")} className="flex items-center gap-1 text-gray-700 hover:text-[#907527] py-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Button 
                  variant="default" 
                  className="bg-[#907527] hover:bg-[#705b1e] w-full flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Link to={companySlug ? `/${companySlug}/login` : "/select-company"}>
                <Button variant="default" className="bg-[#907527] hover:bg-[#705b1e] w-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
