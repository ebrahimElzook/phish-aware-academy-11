import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  LineChart,
  PieChart,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar
} from 'recharts';
import {
  TrendingDown, 
  TrendingUp, 
  Calendar,
  Download
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LMSAnalytics from '@/components/analytics/LMSAnalytics';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

// Mock data for charts
const monthlyData = [
  { name: 'Jan', clickRate: 38, reportRate: 14 },
  { name: 'Feb', clickRate: 35, reportRate: 18 },
  { name: 'Mar', clickRate: 32, reportRate: 22 },
  { name: 'Apr', clickRate: 28, reportRate: 28 },
  { name: 'May', clickRate: 24, reportRate: 32 },
  { name: 'Jun', clickRate: 19, reportRate: 38 },
  { name: 'Jul', clickRate: 15, reportRate: 42 },
  { name: 'Aug', clickRate: 12, reportRate: 48 },
];

const departmentData = [
  { name: 'IT', clickRate: 11, reportRate: 55 },
  { name: 'Marketing', clickRate: 28, reportRate: 39 },
  { name: 'Sales', clickRate: 24, reportRate: 42 },
  { name: 'HR', clickRate: 19, reportRate: 45 },
  { name: 'Finance', clickRate: 26, reportRate: 38 },
  { name: 'Operations', clickRate: 22, reportRate: 40 },
];

const campaignPerformanceData = [
  { name: 'Password Reset', clickRate: 32 },
  { name: 'Security Alert', clickRate: 28 },
  { name: 'Document Share', clickRate: 38 },
  { name: 'Invoice', clickRate: 25 },
  { name: 'Bonus Offer', clickRate: 42 },
];

const responseTimeData = [
  { name: 'Within 1 min', value: 15 },
  { name: '1-5 mins', value: 25 },
  { name: '5-15 mins', value: 35 },
  { name: '15-60 mins', value: 15 },
  { name: '1+ hour', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Analytics & Reports</h1>
              <p className="text-gray-600">Gain insights into your organization's phishing awareness</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-white rounded-md border border-gray-200 px-3 py-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-0 text-sm focus:ring-0 focus:outline-none"
                >
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" /> Export Report
              </Button>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">Average Click Rate</p>
                  <div className="flex items-center text-red-500 text-xs font-medium">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>-12%</span>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">24.8%</p>
                  <span className="ml-2 text-sm text-gray-500">vs 36.5% last period</span>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">Average Report Rate</p>
                  <div className="flex items-center text-green-500 text-xs font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+16%</span>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">38.2%</p>
                  <span className="ml-2 text-sm text-gray-500">vs 22.5% last period</span>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">Most Vulnerable Dept.</p>
                  <div className="flex items-center text-amber-500 text-xs font-medium">
                    <span>High Risk</span>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">Marketing</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">28% click rate</p>
                  <p className="text-xs text-amber-600 mt-1">Needs additional training</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">Most Effective Team</p>
                  <div className="flex items-center text-green-500 text-xs font-medium">
                    <span>Low Risk</span>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">IT</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">11% click rate</p>
                  <p className="text-xs text-green-600 mt-1">High awareness level</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chart Sections */}
          <div className="space-y-8">
            {/* Trend Analysis */}
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle>Phishing Awareness Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
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
            
            {/* Department Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          fill="#ef4444"
                        />
                        <Bar
                          dataKey="reportRate"
                          name="Report Rate (%)"
                          fill="#10b981"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={campaignPerformanceData}
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
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
            
            {/* Response Time Analysis */}
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle>User Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3 flex flex-col justify-center items-center">
                    <h3 className="text-lg font-medium mb-4">Time to Report Phishing</h3>
                    <div className="h-64 w-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={responseTimeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {responseTimeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3 mt-8 lg:mt-0">
                    <h3 className="text-lg font-medium mb-4">Key Insights</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-phish-700 mb-2">Fast Response Time</h4>
                        <p className="text-sm text-gray-600">
                          40% of users report phishing emails within 5 minutes, showing good awareness and quick action.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-red-700 mb-2">Delayed Reporting</h4>
                        <p className="text-sm text-gray-600">
                          25% of users take more than 15 minutes to report, increasing the risk window for potential attacks.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-teal-700 mb-2">Improvement Trend</h4>
                        <p className="text-sm text-gray-600">
                          Average reporting time has decreased by 18% since the start of training, indicating improved awareness.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recommendations */}
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="bg-red-100 text-red-700 p-2 rounded-lg mr-4">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Target Marketing Department</h3>
                      <p className="text-gray-600">
                        The Marketing team shows a consistently high click rate of 28%. Schedule additional focused training sessions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-amber-100 text-amber-700 p-2 rounded-lg mr-4">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Improve Reporting Time</h3>
                      <p className="text-gray-600">
                        25% of users still take more than 15 minutes to report phishing. Run quick response drills to improve this metric.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-teal-100 text-teal-700 p-2 rounded-lg mr-4">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Update Templates</h3>
                      <p className="text-gray-600">
                        The "Bonus Offer" template has the highest click rate at 42%. Create more variations of this scenario for better training.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Analytics;
