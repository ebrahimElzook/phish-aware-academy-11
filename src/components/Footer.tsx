
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-[#907527]" />
              <span className="text-xl font-bold text-[#907527]">CSWORD Academy</span>
            </div>
            <p className="text-gray-600 mb-4">
              Strengthen your organization's security posture with realistic phishing simulations.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-gray-600 hover:text-[#907527]">Dashboard</Link></li>
              <li><Link to="/templates" className="text-gray-600 hover:text-[#907527]">Templates</Link></li>
              <li><Link to="/analytics" className="text-gray-600 hover:text-[#907527]">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-gray-600 hover:text-[#907527]">Blog</Link></li>
              <li><Link to="/guides" className="text-gray-600 hover:text-[#907527]">Guides</Link></li>
              <li><Link to="/case-studies" className="text-gray-600 hover:text-[#907527]">Case Studies</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-[#907527]">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-[#907527]">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-[#907527]">Careers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CSWORD Academy. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-[#907527]">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-[#907527]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
