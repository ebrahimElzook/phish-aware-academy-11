
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Download,
  BookOpen,
  FileText
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LMSAnalytics from '@/components/analytics/LMSAnalytics';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';

const departmentData = [
  { name: 'IT', clickRate: 11, reportRate: 55 }, // This will be replaced later
  { name: 'Marketing', clickRate: 28, reportRate: 39 },
  { name: 'Sales', clickRate: 24, reportRate: 42 },
  { name: 'HR', clickRate: 19, reportRate: 45 },
  { name: 'Finance', clickRate: 26, reportRate: 38 },
  { name: 'Operations', clickRate: 22, reportRate: 40 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface SummaryStats {
  total_campaigns: number;
  total_emails_sent: number;
  total_emails_clicked: number;
  total_emails_read: number;
  average_click_rate: number;
  average_read_rate: number;
}

interface DepartmentPerformance {
  department_id: string | null;
  department_name: string;
  emails_sent: number;
  emails_clicked: number;
  emails_read: number;
  click_rate: number;
  read_rate: number;
}

interface TemporalTrendPoint {
  period: string;
  click_rate: number;
  read_rate: number;
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  const [temporalTrend, setTemporalTrend] = useState<TemporalTrendPoint[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingDeptPerf, setLoadingDeptPerf] = useState(true);
  const [loadingTemporal, setLoadingTemporal] = useState(true);

  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [errorDeptPerf, setErrorDeptPerf] = useState<string | null>(null);
  const [errorTemporal, setErrorTemporal] = useState<string | null>(null);

  const [mostVulnerableDept, setMostVulnerableDept] = useState<DepartmentPerformance | null>(null);
  const [mostEffectiveDept, setMostEffectiveDept] = useState<DepartmentPerformance | null>(null);

  useEffect(() => {
    const fetchData = async (endpoint: string) => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}`, error);
        return null;
      }
    };

    const fetchSummaryData = async () => {
      setLoadingSummary(true);
      setErrorSummary(null);
      try {
        const data = await fetchData(API_ENDPOINTS.ANALYTICS_SUMMARY);
        setSummaryStats(data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setErrorSummary('Failed to fetch summary data');
      } finally {
        setLoadingSummary(false);
      }
    };

    const fetchDepartmentPerformanceData = async () => {
      setLoadingDeptPerf(true);
      setErrorDeptPerf(null);
      try {
        const data = await fetchData(API_ENDPOINTS.ANALYTICS_DEPARTMENT);
        setDepartmentPerformance(data);
      } catch (error) {
        console.error('Error fetching department performance:', error);
        setErrorDeptPerf('Failed to fetch department performance data');
      } finally {
        setLoadingDeptPerf(false);
      }
    };

    // Fetch data when component mounts
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSummaryData(),
          fetchDepartmentPerformanceData()
        ]);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      }
    };

    loadData();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchTemporalData = async (range: string) => {
      setLoadingTemporal(true);
      setErrorTemporal(null);
      try {
        const response = await fetch(`${API_ENDPOINTS.ANALYTICS_TREND}?range=${range}`, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTemporalTrend(data);
      } catch (error) {
        console.error('Failed to fetch temporal trend data', error);
        setErrorTemporal('Failed to fetch temporal trend data');
      } finally {
        setLoadingTemporal(false);
      }
    };

    fetchTemporalData(timeRange);
  }, [timeRange, API_ENDPOINTS.ANALYTICS_TREND]);

  useEffect(() => {
    if (departmentPerformance && departmentPerformance.length > 0) {
      const actualDepartments = departmentPerformance.filter(
        (dept) => dept.department_id !== null
      );

      if (actualDepartments.length > 0) {
        setMostVulnerableDept(
          actualDepartments.reduce((prev, current) => 
            (prev.click_rate > current.click_rate) ? prev : current
          )
        );
        setMostEffectiveDept(
          actualDepartments.reduce((prev, current) => 
            (prev.click_rate < current.click_rate) ? prev : current
          )
        );
      } else {
        setMostVulnerableDept(null);
        setMostEffectiveDept(null);
      }
    } else {
      setMostVulnerableDept(null);
      setMostEffectiveDept(null);
    }
  }, [departmentPerformance]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Analytics & Reports</h1>
              <p className="text-gray-600">Gain insights into your organization's security awareness</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-white rounded-md border border-gray-200 px-3 py-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-0 text-sm focus:ring-0 focus:outline-none"
                >
                  {/* <option value="30days">Last 30 Days</option> TODO: Add if supported by backend */}
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
          
          <Tabs defaultValue="phishing" className="mt-6">
            <TabsList className="mb-8">
              <TabsTrigger value="phishing" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Phishing Analytics
              </TabsTrigger>
              <TabsTrigger value="lms" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                LMS Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phishing">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500">Average Click Rate</p>
                      {/* Trend indicator can be dynamic later */}
                    </div>
                    {loadingSummary ? <p>Loading...</p> : errorSummary ? <p className="text-red-500 text-xs">Error: {errorSummary}</p> : summaryStats ? (
                      <>
                        <h2 className="text-3xl font-bold">{summaryStats.average_click_rate.toFixed(2)}%</h2>
                        <p className="text-xs text-gray-500">
                          {summaryStats.total_emails_clicked} clicked out of {summaryStats.total_emails_sent} emails
                        </p>
                      </>
                    ) : <p className="text-sm text-gray-500">N/A</p>}
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500">Average Read Rate</p>
                      {/* Trend indicator can be dynamic later */}
                    </div>
                    {loadingSummary ? <p>Loading...</p> : errorSummary ? <p className="text-red-500 text-xs">Error: {errorSummary}</p> : summaryStats ? (
                      <>
                        <h2 className="text-3xl font-bold">{summaryStats.average_read_rate.toFixed(2)}%</h2>
                        <p className="text-xs text-gray-500">
                          {summaryStats.total_emails_read} read out of {summaryStats.total_emails_sent} emails
                        </p>
                      </>
                    ) : <p className="text-sm text-gray-500">N/A</p>}
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Total Campaigns</p>
                    {loadingSummary ? <p>Loading...</p> : errorSummary ? <p className="text-red-500 text-xs">Error: {errorSummary}</p> : summaryStats ? (
                      <h2 className="text-3xl font-bold">{summaryStats.total_campaigns}</h2>
                    ) : <p className="text-sm text-gray-500">N/A</p>}
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Total Emails Sent</p>
                    {loadingSummary ? <p>Loading...</p> : errorSummary ? <p className="text-red-500 text-xs">Error: {errorSummary}</p> : summaryStats ? (
                      <h2 className="text-3xl font-bold">{summaryStats.total_emails_sent}</h2>
                    ) : <p className="text-sm text-gray-500">N/A</p>}
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500">Most Vulnerable Dept.</p>
                    </div>
                    {loadingDeptPerf ? <p>Loading...</p> : errorDeptPerf ? <p className="text-red-500 text-xs">Error: {errorDeptPerf}</p> : mostVulnerableDept ? (
                      <>
                        <h2 className="text-2xl font-bold text-red-600">{mostVulnerableDept.department_name}</h2>
                        <p className="text-xs text-gray-500">
                          {mostVulnerableDept.click_rate.toFixed(2)}% Click Rate
                        </p>
                      </>
                    ) : <p className="text-sm text-gray-500">N/A</p>}
                  </CardContent>
                </Card>

                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500">Most Effective Dept.</p>
                      {/* Trend indicator can be dynamic later */}
                    </div>
                    {loadingDeptPerf ? <p>Loading...</p> : errorDeptPerf ? <p className="text-red-500 text-xs">Error: {errorDeptPerf}</p> : mostEffectiveDept ? (
                      <>
                        <h2 className="text-2xl font-bold text-green-600">{mostEffectiveDept.department_name}</h2>
                        <p className="text-xs text-gray-500">
                          {mostEffectiveDept.click_rate.toFixed(2)}% Click Rate
                        </p>
                      </>
                    ) : <p className="text-sm text-gray-500">N/A</p>}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-8">
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle>Phishing Awareness Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {loadingTemporal ? <p>Loading trend data...</p> : errorTemporal ? <p className="text-red-500 text-xs">Error: {errorTemporal}</p> : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={temporalTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis unit="%" domain={[0, 100]} />
                            <Tooltip formatter={(value: number, name: string) => {
                              // 'name' is directly from the <Line name="..."/> prop (e.g., "Click Rate" or "Read Rate").
                              // The value is a number representing a percentage.
                              return [`${value.toFixed(2)}%`, name];
                            }} />
                            <Legend />
                            <Line type="monotone" dataKey="click_rate" name="Click Rate" stroke="#EF4444" activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="read_rate" name="Read Rate" stroke="#22C55E" activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-gray-100">
                    <CardHeader>
                      <CardTitle>Department Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        {loadingDeptPerf ? <p>Loading department data...</p> : errorDeptPerf ? <p className="text-red-500 text-xs">Error: {errorDeptPerf}</p> : departmentPerformance.length === 0 ? <p>No department data available.</p> : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="department_name" angle={-15} textAnchor="end" height={50} interval={0} />
                              <YAxis unit="%" domain={[0, 100]} />
                              <Tooltip formatter={(value: number) => `${value}%`} />
                              <Legend />
                              <Bar dataKey="click_rate" name="Click Rate (%)" fill="#ef4444" />
                              <Bar dataKey="read_rate" name="Read Rate (%)" fill="#22C55E" />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* <Card className="border-gray-100">
                    <CardHeader>
                      <CardTitle>Campaign Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[]} 
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
                  </Card> */}
                </div>
                
                {/* User Response Time Analysis Chart - Temporarily Removed */}
                
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
                          {/* <h3 className="font-medium mb-1">Target Marketing Department</h3>
                          <p className="text-gray-600">
                            The Marketing team shows a consistently high click rate of 28%. Schedule additional focused training sessions.
                          </p> */}
                          {mostVulnerableDept && (
                            <>
                              <h3 className="font-medium mb-1">Focus on: {mostVulnerableDept.department_name}</h3>
                              <p className="text-gray-600">
                                The {mostVulnerableDept.department_name} department shows the highest click rate ({mostVulnerableDept.click_rate.toFixed(2)}%). Consider targeted training.
                              </p>
                            </>
                          )}
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
            </TabsContent>

            <TabsContent value="lms">
              <LMSAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Analytics;
