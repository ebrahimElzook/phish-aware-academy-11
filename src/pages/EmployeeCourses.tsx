
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Award, Book, BookOpen, Check, Clock, Play, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
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
  videos: Video[];
  completed: boolean;
  certificateAvailable: boolean;
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
  
  // Mock courses data for demonstration
  const courses: Course[] = [
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
  
  const handleVideoComplete = () => {
    if (!activeVideo || !activeCourse) return;
    
    if (activeVideo.questions.length > 0) {
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizCompleted(false);
    } else {
      // No questions for this video, mark as completed
      markVideoAsCompleted();
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
                  <Card key={course.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 mb-4" />
                      
                      <div className="text-sm text-muted-foreground mb-4 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Due: {new Date(course.dueDate).toLocaleDateString()}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Videos:</h4>
                        {course.videos.map((video) => (
                          <div key={video.id} className="flex justify-between items-center p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{video.title}</span>
                              {video.completed && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStartVideo(course, video)}
                            >
                              {video.completed ? 'Review' : 'Start'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.filter(course => course.completed).map(course => (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{course.title}</CardTitle>
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Completed
                        </div>
                      </div>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed on: {new Date().toLocaleDateString()}</span>
                        {course.certificateAvailable && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => downloadCertificate(course.id)}
                          >
                            <Award className="h-4 w-4" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
          
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            {/* This would be a real video player in production */}
            <div className="text-center">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-muted-foreground">Video placeholder</p>
              <p className="text-xs text-muted-foreground">Duration: {activeVideo?.duration}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleVideoComplete}>
              Complete and Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Quiz Dialog */}
      <Dialog 
        open={!!activeVideo && showQuiz} 
        onOpenChange={(open) => !open && setShowQuiz(false)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {quizCompleted ? 'Quiz Results' : `Question ${currentQuestionIndex + 1} of ${activeVideo?.questions.length}`}
            </DialogTitle>
          </DialogHeader>
          
          {!quizCompleted ? (
            activeVideo?.questions[currentQuestionIndex] && (
              <div className="py-4">
                <p className="font-medium mb-4">{activeVideo.questions[currentQuestionIndex].text}</p>
                
                <RadioGroup 
                  value={selectedAnswers[activeVideo.questions[currentQuestionIndex].id]} 
                  onValueChange={(value) => handleAnswerSelect(
                    activeVideo.questions[currentQuestionIndex].id, 
                    value
                  )}
                >
                  <div className="space-y-3">
                    {activeVideo.questions[currentQuestionIndex].options.map(option => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.text}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )
          ) : (
            <div className="py-4 text-center">
              <div className="mb-4">
                <div className={`text-2xl font-bold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {score}%
                </div>
                <p className="text-muted-foreground">
                  {score >= 70 
                    ? 'Congratulations! You passed the quiz.' 
                    : 'You did not pass. 70% is required.'}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <p>
                  <span className="font-medium">Correct answers:</span> {activeVideo?.questions.filter(
                    q => q.options.find(o => o.isCorrect)?.id === selectedAnswers[q.id]
                  ).length} of {activeVideo?.questions.length}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {!quizCompleted ? (
              <Button onClick={handleNextQuestion}>
                Next Question
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                {score < 70 && (
                  <Button variant="outline" onClick={restartQuiz}>
                    Retry Quiz
                  </Button>
                )}
                <Button 
                  variant={score >= 70 ? 'default' : 'outline'}
                  className="ml-auto"
                  onClick={() => {
                    setShowQuiz(false);
                    setActiveVideo(null);
                  }}
                >
                  {score >= 70 ? 'Continue' : 'Close'}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default EmployeeCourses;
