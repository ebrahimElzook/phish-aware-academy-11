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
        user = self.request.user
        
        # For super admins
        if user.role == 'SUPER_ADMIN':
            # Priority 1: Check for company_slug in query parameters (from frontend)
            if 'company_slug' in self.request.query_params:
                company_slug = self.request.query_params.get('company_slug')
                print(f"Super admin using company_slug from query params: {company_slug}")
                from accounts.models import Company
                try:
                    company = Company.objects.get(slug=company_slug)
                    print(f"Found company: {company.name}")
                    return Course.objects.filter(companies=company)
                except Company.DoesNotExist:
                    print(f"Company with slug {company_slug} not found")
                    # If company not found, return empty queryset
                    return Course.objects.none()
            
            # Priority 2: Check if there's a company in the request (set by middleware)
            if hasattr(self.request, 'company') and self.request.company:
                print(f"Super admin using company from request: {self.request.company.name}")
                return Course.objects.filter(companies=self.request.company)
            
            # If no specific company context is found, return empty queryset
            # This ensures super admins only see courses in a specific company context
            print("No company context found for super admin, returning empty queryset")
            return Course.objects.none()
        
        # For regular users, use their assigned company
        company = getattr(user, 'company', None)
        if company:
            # Return only courses associated with the user's company
            print(f"Regular user viewing company: {company.name}")
            return Course.objects.filter(companies=company)
        else:
            # If no company is associated with the user, return an empty queryset
            print("No company found for user, returning empty queryset")
            return Course.objects.none()

    @action(detail=False, methods=['get'])
    def list_with_videos(self, request):
        """
        List all courses with their video URLs
        """
        try:
            # Debug information
            print(f"User: {request.user.email if hasattr(request.user, 'email') else 'Anonymous'}") 
            print(f"User role: {request.user.role}")
            print(f"Request path: {request.path}")
            print(f"Query params: {request.query_params}")
            
            # Safely get company information
            company_name = "No company"
            if hasattr(request.user, 'company') and request.user.company:
                company_name = request.user.company.name
            elif hasattr(request, 'company') and request.company:
                company_name = request.company.name
                
            print(f"Company: {company_name}")
            
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
