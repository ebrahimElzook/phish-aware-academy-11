
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileVideo, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config';

// Define the Course type
interface Course {
  id: number;
  name: string;
  type: string;
  description: string;
  video_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export const VideoLibrary = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  useAuth(); // We only need this to ensure user is authenticated

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch(`${API_BASE_URL}/courses/courses/list_with_videos/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load courses. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  // Get unique categories from courses
  const categories = ['All', ...Array.from(new Set(courses.map(course => course.type)))];

  // Filter courses based on selected category
  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.type === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#907527]" />
        <span className="ml-2">Loading courses...</span>
      </div>
    );
  }

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
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="relative group overflow-hidden rounded-lg border hover:shadow-md transition-shadow">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FileVideo className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium truncate">{course.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline">{course.type}</Badge>
                    {course.video_url && (
                      <a 
                        href={course.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Watch Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <FileVideo className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="text-gray-500">No courses are available for your company.</p>
            <p className="text-sm text-gray-400">Courses need to be assigned to your company by an administrator.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
