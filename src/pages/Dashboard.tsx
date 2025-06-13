import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import Video from '@/components/Video';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';

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

interface LMSOverviewDashboard {
  campaigns_count: number;
  enrolled_users: number;
  average_completion: number;
}

const Dashboard = () => {
  const { companySlug } = useParams<{ companySlug?: string }>();
  const lmsCampaignsLink = companySlug ? `/${companySlug}/lms-campaigns` : '/lms-campaigns';

  const [activeTab, setActiveTab] = useState('phishing');

  const [lmsStats, setLmsStats] = useState<LMSOverviewDashboard | null>(null);
  const [lmsError, setLmsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLmsStats = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.LMS_ANALYTICS_OVERVIEW, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = await res.json();
        setLmsStats({
          campaigns_count: data.campaigns_count ?? 0,
          enrolled_users: data.enrolled_users ?? 0,
          average_completion: data.average_completion ?? 0,
        });
      } catch (err) {
        console.error('Failed fetch LMS stats', err);
        setLmsError('Failed to load');
      }
    };

    // fetch once on mount
    fetchLmsStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
              <p className="text-gray-600">Manage your security awareness training</p>
            </div>
          </div>

          <Tabs defaultValue="phishing" className="space-y-4">
            <TabsList>
              <TabsTrigger value="phishing">Phishing Campaigns</TabsTrigger>
              <TabsTrigger value="lms">Training Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="phishing" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="lms" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                        <p className="text-3xl font-bold">
                          {lmsStats ? lmsStats.campaigns_count : lmsError || '...'}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Video className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Enrolled Users</p>
                        <p className="text-3xl font-bold">
                          {lmsStats ? lmsStats.enrolled_users : lmsError || '...'}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                        <p className="text-3xl font-bold">
                          {lmsStats ? `${lmsStats.average_completion.toFixed(2)}%` : lmsError || '...'}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button asChild className="h-full bg-phish-50 hover:bg-phish-100 text-phish-600">
                  <Link to={lmsCampaignsLink} className="flex flex-col items-center justify-center gap-2">
                    <Video className="h-6 w-6" />
                    <span>View All Courses</span>
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
