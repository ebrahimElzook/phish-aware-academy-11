
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from 'lucide-react';

// Mock analytics data
const mockData = {
  totalVideos: 12,
  totalWatched: 856,
  averageCompletion: "78%",
  topVideos: [
    { title: "Password Security Basics", views: 245, completion: "92%" },
    { title: "Social Engineering Awareness", views: 198, completion: "86%" },
    { title: "Data Protection 101", views: 167, completion: "81%" }
  ]
};

const LMSAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            <CardTitle>LMS Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Total Training Videos</p>
              <p className="text-2xl font-bold text-purple-900">{mockData.totalVideos}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-blue-900">{mockData.totalWatched}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Average Completion</p>
              <p className="text-2xl font-bold text-green-900">{mockData.averageCompletion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.topVideos.map((video, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{video.title}</p>
                  <p className="text-sm text-gray-600">{video.views} views</p>
                </div>
                <div className="text-green-600 font-medium">
                  {video.completion} completion
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMSAnalytics;
