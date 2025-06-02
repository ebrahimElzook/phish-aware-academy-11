
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lmsService } from '@/services/api';
import { CourseCard } from "@/components/CourseCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Quiz } from "@/components/Quiz";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Award, 
  Check, 
  Clock, 
  Video, 
  BookOpen 
} from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: QuizOption[];
}

interface Video {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  thumbnail: string;
  questions: Question[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  completed: boolean;
  certificateAvailable: boolean;
  videos: Video[];
}

const EmployeeCourses = () => {
  const { toast } = useToast();
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's assigned campaigns
  useEffect(() => {
    const fetchUserCampaigns = async () => {
      try {
        setLoading(true);
        
        // Check authentication and company context
        const token = localStorage.getItem('token');
        const companySlug = localStorage.getItem('companySlug');
        
        console.log('Auth Token exists:', !!token);
        console.log('Company Slug:', companySlug);
        
        if (!token) {
          console.warn('No authentication token found');
          throw new Error('Authentication required. Please log in again.');
        }
        
        if (!companySlug) {
          console.warn('No company context found');
          throw new Error('Company context required. Please select a company.');
        }
        
        const campaignData = await lmsService.getUserCampaigns();
        console.log('API Response:', campaignData);
        
        if (campaignData && campaignData.length > 0) {
          // Transform campaign data to match the Course interface
          const transformedCourses: Course[] = campaignData.map((campaign: any) => {
            // Create a video object from the course data
            const video: Video = {
              id: campaign.course.id,
              title: campaign.course.title,
              duration: '10:00', // Default duration if not provided by API
              completed: campaign.completed,
              thumbnail: campaign.course.thumbnail || '/placeholder.svg',
              questions: [] // We'll need to fetch questions separately if needed
            };
            
            return {
              id: campaign.id,
              title: campaign.title,
              description: campaign.description,
              dueDate: campaign.dueDate || 'No due date',
              progress: campaign.progress || 0,
              completed: campaign.completed || false,
              certificateAvailable: campaign.certificateAvailable || false,
              videos: [video] // For now, assuming one video per course
            };
          });
          
          setCourses(transformedCourses);
          toast({
            title: "Success",
            description: `Loaded ${transformedCourses.length} courses from the server.`,
          });
        } else {
          // No campaigns returned, use mock data
          console.log('No campaigns returned from API, using mock data');
          setCourses(mockCourses);
          toast({
            title: "Notice",
            description: "No courses found. Using sample data for demonstration.",
          });
        }
      } catch (err) {
        console.error('Error fetching user campaigns:', err);
        toast({
          title: "Error",
          description: "Failed to load your courses. Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to mock data
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCampaigns();
  }, [toast]);

  // Mock courses data as fallback
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Security Awareness Basics',
      description: 'Learn the fundamentals of cybersecurity and how to protect yourself and your organization.',
      dueDate: '2025-05-30',
      progress: 25,
      completed: false,
      certificateAvailable: false,
      videos: [
        {
          id: 'v1',
          title: 'Password Security',
          duration: '8:32',
          completed: false,
          thumbnail: '/placeholder.svg',
          questions: [
            {
              id: 'q1',
              text: 'What is the recommended minimum password length?',
              options: [
                { id: 'a1', text: '6 characters', isCorrect: false },
                { id: 'a2', text: '8 characters', isCorrect: false },
                { id: 'a3', text: '12 characters', isCorrect: true },
                { id: 'a4', text: '4 characters', isCorrect: false }
              ]
            },
            {
              id: 'q2',
              text: 'Which of the following is the most secure password?',
              options: [
                { id: 'a1', text: 'password123', isCorrect: false },
                { id: 'a2', text: 'P@$$w0rd!', isCorrect: true },
                { id: 'a3', text: 'abcdef', isCorrect: false },
                { id: 'a4', text: '123456', isCorrect: false }
              ]
            }
          ]
        },
        {
          id: 'v2',
          title: 'Email Safety',
          duration: '12:15',
          completed: false,
          thumbnail: '/placeholder.svg',
          questions: [
            {
              id: 'q1',
              text: 'What is phishing?',
              options: [
                { id: 'a1', text: 'A fishing technique', isCorrect: false },
                { id: 'a2', text: 'A type of computer virus', isCorrect: false },
                { id: 'a3', text: 'An attempt to trick users into revealing sensitive information', isCorrect: true },
                { id: 'a4', text: 'A hacking tool', isCorrect: false }
              ]
            }
          ]
        },
        {
          id: 'v3',
          title: 'Social Engineering',
          duration: '15:45',
          completed: false,
          thumbnail: '/placeholder.svg',
          questions: [
            {
              id: 'q1',
              text: 'What is social engineering?',
              options: [
                { id: 'a1', text: 'Building social networks', isCorrect: false },
                { id: 'a2', text: 'Manipulating people to divulge confidential information', isCorrect: true },
                { id: 'a3', text: 'Engineering social media platforms', isCorrect: false },
                { id: 'a4', text: 'A type of firewall', isCorrect: false }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Data Protection Essentials',
      description: 'Understand how to protect sensitive data and comply with regulations.',
      dueDate: '2025-06-15',
      progress: 0,
      completed: false,
      certificateAvailable: false,
      videos: [
        {
          id: 'v1',
          title: 'Data Classification',
          duration: '10:20',
          completed: false,
          thumbnail: '/placeholder.svg',
          questions: [
            {
              id: 'q1',
              text: 'What is the purpose of data classification?',
              options: [
                { id: 'a1', text: 'To organize data by size', isCorrect: false },
                { id: 'a2', text: 'To identify sensitive information and apply appropriate protections', isCorrect: true },
                { id: 'a3', text: 'To delete unnecessary data', isCorrect: false },
                { id: 'a4', text: 'To increase storage space', isCorrect: false }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'Phishing Prevention',
      description: 'Learn to identify and avoid phishing attempts.',
      dueDate: '2025-05-20',
      progress: 100,
      completed: true,
      certificateAvailable: true,
      videos: [
        {
          id: 'v1',
          title: 'Recognizing Phishing Emails',
          duration: '9:45',
          completed: true,
          thumbnail: '/placeholder.svg',
          questions: []
        },
        {
          id: 'v2',
          title: 'What to Do When You Suspect Phishing',
          duration: '6:30',
          completed: true,
          thumbnail: '/placeholder.svg',
          questions: []
        }
      ]
    }
  ];
  
  const handleStartVideo = (course: Course, video: Video) => {
    setActiveCourse(course);
    setActiveVideo(video);
    setShowQuiz(false);
    setQuizCompleted(false);
  };
  
  const markVideoAsCompleted = () => {
    if (!activeVideo || !activeCourse) return;
    
    // In a real app, this would save to the backend
    // For now, we just update the mock data
    const updatedCourses = courses.map(course => {
      if (course.id === activeCourse.id) {
        const updatedVideos = course.videos.map(video => {
          if (video.id === activeVideo.id) {
            return { ...video, completed: true };
          }
          return video;
        });
        
        const completedCount = updatedVideos.filter(v => v.completed).length;
        const newProgress = Math.round((completedCount / updatedVideos.length) * 100);
        const allCompleted = completedCount === updatedVideos.length;
        
        return { 
          ...course, 
          videos: updatedVideos, 
          progress: newProgress,
          completed: allCompleted,
          certificateAvailable: allCompleted
        };
      }
      return course;
    });
    
    setCourses(updatedCourses);
    
    // Update active course with new data
    const updatedCourse = updatedCourses.find(c => c.id === activeCourse.id);
    if (updatedCourse) {
      setActiveCourse(updatedCourse);
    }
    
    toast({
      title: "Video Completed",
      description: "This video has been marked as completed.",
    });
  };
  
  const handleVideoComplete = () => {
    if (activeVideo) {
      // Check if the video has questions
      if (activeVideo.questions && activeVideo.questions.length > 0) {
        // After video is complete, show quiz if available
        setShowQuiz(true);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setQuizCompleted(false);
      } else {
        // If no questions, mark the video as completed immediately
        markVideoAsCompleted();
        toast({
          title: "Video Completed",
          description: "You've successfully completed this video.",
        });
      }
    }
  };
  
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const handleNextQuestion = () => {
    const currentQuestion = activeVideo?.questions[currentQuestionIndex];
    if (!currentQuestion || !selectedAnswers[currentQuestion.id]) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentQuestionIndex < (activeVideo?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed
      calculateScore();
    }
  };
  
  const calculateScore = () => {
    if (!activeVideo) return;
    
    let correct = 0;
    activeVideo.questions.forEach(question => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctOption = question.options.find(option => option.isCorrect);
      
      if (selectedAnswerId && correctOption && selectedAnswerId === correctOption.id) {
        correct++;
      }
    });
    
    const percentage = Math.round((correct / activeVideo.questions.length) * 100);
    setScore(percentage);
    setQuizCompleted(true);
    
    if (percentage >= 70) {
      // Pass threshold
      markVideoAsCompleted();
      toast({
        title: "Quiz Completed",
        description: `You scored ${percentage}% and passed the quiz!`,
      });
    } else {
      toast({
        title: "Quiz Failed",
        description: `You scored ${percentage}%. 70% is required to pass.`,
        variant: "destructive",
      });
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
  };
  
  const downloadCertificate = (courseId: string) => {
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Training Courses</h1>
          
          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active Courses</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="certificates">My Certificates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.filter(course => !course.completed).map(course => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                    onStartVideo={(video) => handleStartVideo(course, video)}
                  />
                ))}
                
                {courses.filter(course => !course.completed).length === 0 && (
                  <div className="col-span-2 text-center p-8">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium">No Active Courses</h3>
                    <p className="text-muted-foreground">
                      You don't have any active courses assigned to you at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.filter(course => course.completed).map(course => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                    onStartVideo={(video) => handleStartVideo(course, video)}
                    onDownloadCertificate={course.certificateAvailable ? () => downloadCertificate(course.id) : undefined}
                  />
                ))}
                
                {courses.filter(course => course.completed).length === 0 && (
                  <div className="col-span-2 text-center p-8">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium">No Completed Courses</h3>
                    <p className="text-muted-foreground">
                      You haven't completed any courses yet. Start learning to see your progress here.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="certificates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.filter(course => course.certificateAvailable).map(course => (
                  <Card key={course.id} className="overflow-hidden">
                    <CardHeader className="bg-amber-50">
                      <div className="flex items-center justify-between">
                        <CardTitle>{course.title}</CardTitle>
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm">
                        Issued on: {new Date().toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="bg-gray-50">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => downloadCertificate(course.id)}
                      >
                        Download Certificate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {courses.filter(course => course.certificateAvailable).length === 0 && (
                  <div className="col-span-2 text-center p-8">
                    <Award className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium">No Certificates Yet</h3>
                    <p className="text-muted-foreground">
                      Complete your assigned courses to earn certificates.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    
    {/* Video Player Dialog */}
    <Dialog open={!!activeVideo && !showQuiz} onOpenChange={(open) => !open && setActiveVideo(null)}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{activeVideo?.title}</DialogTitle>
        </DialogHeader>
        
        {activeVideo && (
          <VideoPlayer 
            title={activeVideo.title}
            thumbnail={activeVideo.thumbnail}
            onComplete={handleVideoComplete}
          />
        )}
      </DialogContent>
    </Dialog>
    
    {/* Quiz Dialog */}
    <Dialog 
      open={!!activeVideo && showQuiz} 
      onOpenChange={(open) => !open && setShowQuiz(false)}
    >
      <DialogContent className="sm:max-w-[600px]">
        {activeVideo && activeVideo.questions.length > 0 && (
          <Quiz 
            questions={activeVideo.questions}
            onComplete={(quizScore) => {
              setScore(quizScore);
              if (quizScore >= 70) {
                // Pass threshold
                markVideoAsCompleted();
              }
            }}
          />
        )}
      </DialogContent>
    </Dialog>
    
    <Footer />
  </div>
  );
};

export default EmployeeCourses;
