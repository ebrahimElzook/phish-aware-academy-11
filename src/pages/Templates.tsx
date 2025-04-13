
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Mail, CreditCard, Gift, AlertTriangle, FileText, ShieldAlert, Share2, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock template data
const templates = [
  {
    id: 1,
    name: 'Password Reset',
    category: 'Account Security',
    description: 'Email requesting password reset with suspicious link',
    difficulty: 'Easy',
    icon: <Mail className="h-10 w-10 text-phish-500" />,
  },
  {
    id: 2,
    name: 'Payment Confirmation',
    category: 'Financial',
    description: 'Fake invoice or payment receipt with malicious attachment',
    difficulty: 'Medium',
    icon: <CreditCard className="h-10 w-10 text-phish-500" />,
  },
  {
    id: 3,
    name: 'Gift Card Offer',
    category: 'Promotions',
    description: 'Free gift card offer requiring personal information',
    difficulty: 'Easy',
    icon: <Gift className="h-10 w-10 text-phish-500" />,
  },
  {
    id: 4,
    name: 'Account Suspension',
    category: 'Account Security',
    description: 'Notification about account suspension requiring immediate action',
    difficulty: 'Medium',
    icon: <AlertTriangle className="h-10 w-10 text-phish-500" />,
  },
  {
    id: 5,
    name: 'Document Share',
    category: 'Business',
    description: 'Shared document requiring login to view content',
    difficulty: 'Hard',
    icon: <FileText className="h-10 w-10 text-phish-500" />,
  },
  {
    id: 6,
    name: 'Security Alert',
    category: 'Account Security',
    description: 'Urgent security alert requiring verification',
    difficulty: 'Medium',
    icon: <ShieldAlert className="h-10 w-10 text-phish-500" />,
  },
  {
    id: 7,
    name: 'File Share Request',
    category: 'Business',
    description: 'Request to access shared files with suspicious URL',
    difficulty: 'Hard',
    icon: <Share2 className="h-10 w-10 text-phish-500" />,
  },
  {
    id: 8,
    name: 'Job Opportunity',
    category: 'Career',
    description: 'Unsolicited job offer requiring personal information',
    difficulty: 'Medium',
    icon: <Briefcase className="h-10 w-10 text-phish-500" />,
  },
];

// Template categories
const categories = [
  'All',
  'Account Security',
  'Financial',
  'Promotions',
  'Business',
  'Career',
];

// Difficulty levels
const difficultyLevels = [
  'All',
  'Easy',
  'Medium',
  'Hard',
];

const Templates = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('All');
  
  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Phishing Templates</h1>
              <p className="text-gray-600">Browse and customize templates for your phishing simulations</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-phish-600 hover:bg-phish-700">
                <PlusCircle className="h-4 w-4 mr-2" /> Create Custom Template
              </Button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-phish-50 p-4 rounded-full mb-4">
                        {template.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {template.category}
                        </span>
                        <span className={`ml-2 text-xs font-medium px-2 py-1 rounded ${
                          template.difficulty === 'Easy' 
                            ? 'bg-green-100 text-green-800' 
                            : template.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {template.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{template.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 bg-gray-50 flex justify-center border-t border-gray-100">
                    <Button variant="outline" className="w-full text-phish-600 border-phish-200 hover:bg-phish-50">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-lg text-gray-600">No templates found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Templates;
