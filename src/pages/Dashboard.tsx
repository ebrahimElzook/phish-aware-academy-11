
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar
} from 'recharts';
import { PlusCircle, Mail, AlertCircle, CheckCircle, TrendingUp, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data for charts
const campaignData = [
  { name: 'Week 1', clickRate: 32, reportRate: 18 },
  { name: 'Week 2', clickRate: 28, reportRate: 22 },
  { name: 'Week 3', clickRate: 24, reportRate: 28 },
  { name: 'Week 4', clickRate: 19, reportRate: 34 },
  { name: 'Week 5', clickRate: 15, reportRate: 42 },
  { name: 'Week 6', clickRate: 12, reportRate: 48 },
];

const departmentData = [
  { name: 'IT', clickRate: 11 },
  { name: 'Marketing', clickRate: 28 },
  { name: 'Sales', clickRate: 24 },
  { name: 'HR', clickRate: 19 },
  { name: 'Finance', clickRate: 26 },
  { name: 'Operations', clickRate: 22 },
];

// Mock campaign data
const campaigns = [
  { 
    id: 1, 
    name: 'Password Reset Campaign', 
    status: 'Active',
    sentDate: '2025-04-10',
    targets: 85,
    clicks: 17,
    reports: 8
  },
  { 
    id: 2, 
    name: 'Bonus Announcement', 
    status: 'Completed',
    sentDate: '2025-04-02',
    targets: 120,
    clicks: 36,
    reports: 12
  },
  { 
    id: 3, 
    name: 'IT Security Update', 
    status: 'Draft',
    sentDate: '-',
    targets: 0,
    clicks: 0,
    reports: 0
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
              <p className="text-gray-600">Manage and monitor your phishing campaigns</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <Button asChild className="bg-phish-600 hover:bg-phish-700">
                <Link to="/lms-campaigns">
                  <Video className="h-4 w-4 mr-2" />
                  Training Videos
                </Link>
              </Button>
              <Button className="bg-phish-600 hover:bg-phish-700">
                <PlusCircle className="h-4 w-4 mr-2" /> New Campaign
              </Button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="bg-phish-50 p-3 rounded-lg">
                    <Mail className="h-5 w-5 text-phish-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Up 10% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Click Rate</p>
                    <p className="text-3xl font-bold">24.8%</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-red-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Up 3% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Report Rate</p>
                    <p className="text-3xl font-bold">36.5%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Up 12% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Targets</p>
                    <p className="text-3xl font-bold">205</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-blue-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Added 15 new this month</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-phish-600 text-phish-600'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`pb-4 px-1 ${
                  activeTab === 'campaigns'
                    ? 'border-b-2 border-phish-600 text-phish-600'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`pb-4 px-1 ${
                  activeTab === 'templates'
                    ? 'border-b-2 border-phish-600 text-phish-600'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('audience')}
                className={`pb-4 px-1 ${
                  activeTab === 'audience'
                    ? 'border-b-2 border-phish-600 text-phish-600'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium`}
              >
                Audience
              </button>
            </div>
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle>Phishing Awareness Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={campaignData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="clickRate"
                            name="Click Rate (%)"
                            stroke="#ef4444"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="reportRate"
                            name="Report Rate (%)"
                            stroke="#10b981"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle>Department Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={departmentData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="clickRate"
                            name="Click Rate (%)"
                            fill="#0ea5e9"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Campaigns */}
              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="pb-3 font-medium text-gray-500">Campaign Name</th>
                          <th className="pb-3 font-medium text-gray-500">Status</th>
                          <th className="pb-3 font-medium text-gray-500">Sent Date</th>
                          <th className="pb-3 font-medium text-gray-500">Targets</th>
                          <th className="pb-3 font-medium text-gray-500">Click Rate</th>
                          <th className="pb-3 font-medium text-gray-500">Report Rate</th>
                          <th className="pb-3 font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign) => (
                          <tr key={campaign.id} className="border-b border-gray-100">
                            <td className="py-4 font-medium">{campaign.name}</td>
                            <td className="py-4">
                              <span 
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  campaign.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : campaign.status === 'Draft'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {campaign.status}
                              </span>
                            </td>
                            <td className="py-4 text-gray-600">{campaign.sentDate}</td>
                            <td className="py-4 text-gray-600">{campaign.targets}</td>
                            <td className="py-4 text-gray-600">
                              {campaign.targets ? `${Math.round((campaign.clicks / campaign.targets) * 100)}%` : '-'}
                            </td>
                            <td className="py-4 text-gray-600">
                              {campaign.targets ? `${Math.round((campaign.reports / campaign.targets) * 100)}%` : '-'}
                            </td>
                            <td className="py-4">
                              <Button variant="ghost" size="sm" className="text-phish-600 hover:text-phish-700 hover:bg-phish-50">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Simplified placeholder content for other tabs */}
          {activeTab === 'campaigns' && (
            <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Campaign Management</h3>
              <p className="text-gray-600 mb-6">Create and manage your phishing simulation campaigns</p>
              <Button className="bg-phish-600 hover:bg-phish-700">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New Campaign
              </Button>
            </div>
          )}
          
          {activeTab === 'templates' && (
            <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Phishing Templates</h3>
              <p className="text-gray-600 mb-6">Browse and customize phishing email templates</p>
              <Button className="bg-phish-600 hover:bg-phish-700">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New Template
              </Button>
            </div>
          )}
          
          {activeTab === 'audience' && (
            <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Target Audience</h3>
              <p className="text-gray-600 mb-6">Manage your target groups and individual recipients</p>
              <Button className="bg-phish-600 hover:bg-phish-700">
                <PlusCircle className="h-4 w-4 mr-2" /> Add New Audience
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
