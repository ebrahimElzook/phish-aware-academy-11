from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Course
from .serializers import CourseSerializer
from django.conf import settings

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the current company from the request
        company = getattr(self.request.user, 'company', None)
        
        if company:
            # Return only courses associated with the user's company
            return Course.objects.filter(companies=company)
        else:
            # If no company is associated with the user, return an empty queryset
            return Course.objects.none()

    @action(detail=False, methods=['get'])
    def list_with_videos(self, request):
        """
        List all courses with their video URLs
        """
        try:
            # Debug information
            print(f"User: {request.user.email if hasattr(request.user, 'email') else 'Anonymous'}") 
            print(f"Company: {request.user.company.name if hasattr(request.user, 'company') else 'No company'}") 
            
            # Get all courses for debugging
            all_courses = Course.objects.all()
            print(f"Total courses in database: {all_courses.count()}")
            for course in all_courses:
                print(f"Course: {course.name}, Companies: {[c.name for c in course.companies.all()]}")
            
            # Get filtered courses
            courses = self.get_queryset()
            print(f"Filtered courses count: {courses.count()}")
            
            serializer = self.get_serializer(courses, many=True)
            
            # Add full video and thumbnail URLs to the response
            data = []
            for course in serializer.data:
                course_data = dict(course)
                if course.get('video'):
                    course_data['video_url'] = request.build_absolute_uri(course['video'])
                if course.get('thumbnail'):
                    course_data['thumbnail_url'] = request.build_absolute_uri(course['thumbnail'])
                data.append(course_data)
                
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error in list_with_videos: {str(e)}")  # Log the error
            return Response(
                {'error': 'Failed to fetch courses', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
