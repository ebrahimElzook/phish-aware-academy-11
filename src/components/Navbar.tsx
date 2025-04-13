
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, Menu } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-phish-600" />
          <span className="text-2xl font-bold gradient-text">PhishAware</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-phish-600 transition-colors">Home</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-phish-600 transition-colors">Dashboard</Link>
          <Link to="/templates" className="text-gray-700 hover:text-phish-600 transition-colors">Templates</Link>
          <Link to="/analytics" className="text-gray-700 hover:text-phish-600 transition-colors">Analytics</Link>
          <Button variant="default" className="bg-phish-600 hover:bg-phish-700">Get Started</Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 py-2 px-4 animate-in">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-phish-600 transition-colors py-2">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-phish-600 transition-colors py-2">Dashboard</Link>
            <Link to="/templates" className="text-gray-700 hover:text-phish-600 transition-colors py-2">Templates</Link>
            <Link to="/analytics" className="text-gray-700 hover:text-phish-600 transition-colors py-2">Analytics</Link>
            <Button variant="default" className="bg-phish-600 hover:bg-phish-700 w-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
