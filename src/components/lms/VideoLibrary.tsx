
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileVideo, CheckCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Mock video data with categories and authorization status
const mockVideos = [
  {
    id: 'v1',
    title: 'Security Basics Training',
    category: 'Security',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    authorized: true
  },
  {
    id: 'v2',
    title: 'Password Management',
    category: 'Security',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    authorized: true
  },
  {
    id: 'v3',
    title: 'Social Engineering Awareness',
    category: 'Awareness',
    thumbnail: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    authorized: false
  },
  {
    id: 'v4',
    title: 'Data Protection 101',
    category: 'Compliance',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    authorized: true
  },
  {
    id: 'v5',
    title: 'GDPR Training',
    category: 'Compliance',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    authorized: false
  },
  {
    id: 'v6',
    title: 'Secure Coding Practices',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    authorized: true
  }
];

// Get unique categories from video data
const categories = ['All', ...Array.from(new Set(mockVideos.map(video => video.category)))];

export const VideoLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter videos based on selected category
  const filteredVideos = selectedCategory === 'All' 
    ? mockVideos 
    : mockVideos.filter(video => video.category === selectedCategory);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5 text-[#907527]" />
          Video Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full max-w-xs">
            <Label htmlFor="category-filter" className="mb-2 block">Filter by Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Authorized
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Not Authorized
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="relative group overflow-hidden rounded-lg border hover:shadow-md transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {video.authorized ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">Authorized</Badge>
                  ) : (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">Not Authorized</Badge>
                  )}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium truncate">{video.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">{video.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
