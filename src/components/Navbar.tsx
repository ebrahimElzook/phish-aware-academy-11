
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, Bot, BookOpen, FileText, BarChart, Users, Mail } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  
  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/876a553e-d478-4016-a8f0-1580f492ca19.png" alt="CSWORD Logo" className="h-10" />
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`transition-colors ${location.pathname === "/" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            الرئيسية
          </Link>
          <Link to="/dashboard" className={`transition-colors ${location.pathname === "/dashboard" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            لوحة التحكم
          </Link>
          <Link to="/templates" className={`transition-colors ${location.pathname === "/templates" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>القوالب</span>
            </div>
          </Link>
          <Link to="/campaigns" className={`transition-colors ${location.pathname === "/campaigns" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>الحملات</span>
            </div>
          </Link>
          <Link to="/analytics" className={`transition-colors ${location.pathname === "/analytics" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            <div className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>التحليلات</span>
            </div>
          </Link>
          <Link to="/lms-campaigns" className={`transition-colors ${location.pathname === "/lms-campaigns" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>التدريب</span>
            </div>
          </Link>
          <Link to="/user-management" className={`transition-colors ${location.pathname === "/user-management" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>المستخدمين</span>
            </div>
          </Link>
          <Link to="/ai-support" className={`transition-colors ${location.pathname === "/ai-support" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
            <div className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span>الدعم الذكي</span>
            </div>
          </Link>
          <Link to="/login">
            <Button variant="default" className="bg-[#907527] hover:bg-[#705b1e]">تسجيل الدخول</Button>
          </Link>
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
            <Link to="/" className={`transition-colors py-2 ${location.pathname === "/" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              الرئيسية
            </Link>
            <Link to="/dashboard" className={`transition-colors py-2 ${location.pathname === "/dashboard" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              لوحة التحكم
            </Link>
            <Link to="/templates" className={`transition-colors py-2 ${location.pathname === "/templates" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>القوالب</span>
              </div>
            </Link>
            <Link to="/campaigns" className={`transition-colors py-2 ${location.pathname === "/campaigns" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>الحملات</span>
              </div>
            </Link>
            <Link to="/analytics" className={`transition-colors py-2 ${location.pathname === "/analytics" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>التحليلات</span>
              </div>
            </Link>
            <Link to="/lms-campaigns" className={`transition-colors py-2 ${location.pathname === "/lms-campaigns" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>التدريب</span>
              </div>
            </Link>
            <Link to="/user-management" className={`transition-colors py-2 ${location.pathname === "/user-management" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>المستخدمين</span>
              </div>
            </Link>
            <Link to="/ai-support" className={`transition-colors py-2 ${location.pathname === "/ai-support" ? "text-[#907527]" : "text-gray-700 hover:text-[#907527]"}`}>
              <div className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                <span>الدعم الذكي</span>
              </div>
            </Link>
            <Link to="/login">
              <Button variant="default" className="bg-[#907527] hover:bg-[#705b1e] w-full">تسجيل الدخول</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
