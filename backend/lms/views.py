from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from courses.models import Course, Question
from accounts.models import Company, User
from .models import LMSCampaign, LMSCampaignUser, UserCourseProgress
from django.utils import timezone
from django.db.models import Q
import json


@staff_member_required
def get_courses_for_company(request):
    """AJAX view to get courses for a specific company"""
    company_id = request.GET.get('company_id')
    if not company_id:
        return JsonResponse([], safe=False)
    
    try:
        company = Company.objects.get(id=company_id)
        # Get courses available for this company
        courses = Course.objects.filter(companies=company)
        
        # Format data for JSON response
        data = [{'id': course.id, 'name': course.name} for course in courses]
        return JsonResponse(data, safe=False)
    except Company.DoesNotExist:
        return JsonResponse([], safe=False)


@staff_member_required
def get_users_for_company(request):
    """AJAX view to get users for a specific company"""
    company_id = request.GET.get('company_id')
    if not company_id:
        return JsonResponse([], safe=False)
    
    try:
        company = Company.objects.get(id=company_id)
        # Get users for this company
        users = User.objects.filter(company=company)
        
        # Format data for JSON response
        data = [{'id': user.id, 'name': f"{user.email} ({user.username})"} for user in users]
        return JsonResponse(data, safe=False)
    except Company.DoesNotExist:
        return JsonResponse([], safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lms_campaigns(request):
    """API endpoint to get LMS campaigns for the current user's company"""
    user = request.user
    
    # Check if user is a Super Admin
    is_super_admin = False
    if hasattr(user, 'role'):
        # Check for 'SUPER_ADMIN' (correct case from User model)
        is_super_admin = user.role == 'SUPER_ADMIN'
    elif hasattr(user, 'is_superuser'):
        is_super_admin = user.is_superuser
    
    # Get the user's company
    company = user.company
    
    # Handle Super Admins differently
    if is_super_admin:
        # For Super Admins, return all campaigns or an empty list
        if not company:
            # Return all campaigns for Super Admins without a company
            campaigns = LMSCampaign.objects.all()
        else:
            # Return campaigns for the Super Admin's company if they have one
            campaigns = LMSCampaign.objects.filter(company=company)
    else:
        # For regular users, require a company
        if not company:
            return Response({"error": "User does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get campaigns for this company
        campaigns = LMSCampaign.objects.filter(company=company)
    
    # Format data for response
    data = []
    for campaign in campaigns:
        # Get stats for this campaign
        total_users = LMSCampaignUser.objects.filter(campaign=campaign).count()
        completed_users = LMSCampaignUser.objects.filter(campaign=campaign, completed=True).count()
        in_progress_users = LMSCampaignUser.objects.filter(campaign=campaign, started=True, completed=False).count()
        not_started_users = total_users - completed_users - in_progress_users
        
        # Calculate average completion percentage
        avg_completion = "0%"
        if total_users > 0:
            avg_completion = f"{int((completed_users / total_users) * 100)}%"
        
        # Format campaign data
        campaign_data = {
            "id": campaign.id,
            "title": campaign.name,
            "course": ", ".join([course.name for course in campaign.courses.all()]) if campaign.courses.exists() else "",
            "audience": "All Employees",  # This could be more specific based on your requirements
            "videoCount": 1,  # This could be calculated based on course content
            "startDate": campaign.start_date.strftime("%Y-%m-%d") if campaign.start_date else "",
            "endDate": campaign.end_date.strftime("%Y-%m-%d") if campaign.end_date else "",
            "stats": {
                "totalEnrolled": total_users,
                "completed": completed_users,
                "inProgress": in_progress_users,
                "notStarted": not_started_users,
                "averageCompletion": avg_completion
            }
        }
        data.append(campaign_data)
    
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_lms_campaign(request):
    """API endpoint to create a new LMS campaign"""
    user = request.user
    
    # Check if user has permission to create campaigns
    if not user.is_staff:
        return Response({"error": "You do not have permission to create campaigns"}, status=status.HTTP_403_FORBIDDEN)
    
    # Get the user's company
    company = user.company
    if not company:
        return Response({"error": "User does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get request data
    try:
        data = request.data
        name = data.get('name')
        course_ids = data.get('course_ids', [])  # Changed from course_id to course_ids
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        selected_users = data.get('selected_users', [])
        
        # Validate required fields
        if not name or not course_ids:  # Check for course_ids instead of course_id
            return Response({"error": "Name and at least one course are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the campaign
        campaign = LMSCampaign.objects.create(
            name=name,
            company=company,
            created_by=user,
            start_date=start_date,
            end_date=end_date
        )
        
        # Add courses to the campaign
        for course_id in course_ids:
            try:
                course = Course.objects.get(id=course_id)
                # Verify course belongs to company
                if not course.companies.filter(id=company.id).exists():
                    return Response({"error": f"Course {course.name} does not belong to your company"}, status=status.HTTP_400_BAD_REQUEST)
                campaign.courses.add(course)
            except Course.DoesNotExist:
                return Response({"error": f"Course with ID {course_id} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Add selected users to the campaign
        for user_id in selected_users:
            try:
                user = User.objects.get(id=user_id, company=company)
                LMSCampaignUser.objects.create(campaign=campaign, user=user)
            except User.DoesNotExist:
                # Skip users that don't exist or don't belong to the company
                continue
        
        # Return success response
        return Response({
            "success": True,
            "campaign_id": campaign.id,
            "message": "Campaign created successfully"
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_campaigns(request):
    """API endpoint to get LMS campaigns assigned to the current user"""
    user = request.user
    
    # Get the user's company
    company = user.company
    if not company:
        return Response({"error": "User does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get current date for filtering campaigns
    current_date = timezone.now().date()
    
    try:
        # Get campaigns assigned to this user that are in the same company
        user_campaign_relations = LMSCampaignUser.objects.filter(
            user=user,
            campaign__company=company
        ).select_related('campaign').prefetch_related('campaign__courses')
        
        # Include campaigns that have already started. We exclude only those that
        # are scheduled for the future (start_date > today).  This ensures that
        # campaigns whose end_date has already passed are still returned so the
        # frontend can list them under the "Completed" tab.
        filtered_campaigns = []
        for relation in user_campaign_relations:
            campaign = relation.campaign
            
            # Skip campaigns where the start date is in the future
            if campaign.start_date and campaign.start_date > current_date:
                continue
            
            filtered_campaigns.append({
                "relation": relation,
                "campaign": campaign
            })
        
        # Format data for response
        data = []
        for item in filtered_campaigns:
            campaign = item["campaign"]
            relation = item["relation"]
            
            # Get all courses for this campaign
            campaign_courses = list(campaign.courses.all())
            
            # If no courses, skip this campaign
            if not campaign_courses:
                continue
                
            # Prepare list of course data and track completion
            courses_data = []
            completed_courses_count = 0

            for course in campaign_courses:
                # Check course completion status from UserCourseProgress
                try:
                    progress_record = UserCourseProgress.objects.get(
                        campaign_user=relation,
                        course=course
                    )
                    is_completed = progress_record.completed
                except UserCourseProgress.DoesNotExist:
                    is_completed = False
                
                if is_completed:
                    completed_courses_count += 1

                # Get course details
                course_data = {
                    "id": str(course.id),
                    "title": course.name,
                    "description": course.description or "",
                    "thumbnail": request.build_absolute_uri(course.thumbnail.url) if course.thumbnail else "",
                    "video": request.build_absolute_uri(course.video.url) if course.video else "",
                    "completed": is_completed
                }
                courses_data.append(course_data)
            
            # Calculate campaign progress
            total_courses_count = len(campaign_courses)
            campaign_progress = 0
            if total_courses_count > 0:
                campaign_progress = int((completed_courses_count / total_courses_count) * 100)

            # The campaign is considered completed if:
            #   1. All courses are completed, OR
            #   2. The campaign has expired (end_date < today)
            is_fully_completed = total_courses_count > 0 and completed_courses_count == total_courses_count
            is_expired = campaign.end_date is not None and campaign.end_date < current_date

            campaign_completed = is_fully_completed or is_expired

            # Certificate should be available only when fully completed.
            certificate_available = is_fully_completed
            
            # Format campaign data with multiple courses
            campaign_data = {
                "id": str(campaign.id),
                "title": campaign.name,
                "description": courses_data[0]["description"] if courses_data else "",
                "dueDate": campaign.end_date.strftime("%Y-%m-%d") if campaign.end_date else "",
                "progress": campaign_progress,
                "completed": campaign_completed,
                "certificateAvailable": certificate_available,
                "courses": courses_data,
                "totalCourses": total_courses_count,
                "completedCourses": completed_courses_count,
            }
            data.append(campaign_data)
        
        return Response(data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_course_completed(request):
    """API endpoint to mark a course as completed for the current user."""
    user = request.user
    
    try:
        data = request.data
        campaign_id = data.get('campaign_id')
        course_id = data.get('course_id')
        
        if not campaign_id or not course_id:
            return Response({"error": "Campaign ID and Course ID are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Get the specific campaign-user relation
        campaign_user = LMSCampaignUser.objects.get(user=user, campaign_id=campaign_id)
        
        # Get the course
        course = Course.objects.get(id=course_id)
        
        # Create or update the progress record
        progress, created = UserCourseProgress.objects.update_or_create(
            campaign_user=campaign_user,
            course=course,
            defaults={'completed': True, 'completed_at': timezone.now()}
        )

        # Mark campaign as started on first completed course
        if not campaign_user.started:
            campaign_user.started = True
            campaign_user.started_at = timezone.now()
            campaign_user.save(update_fields=['started', 'started_at'])

        # After marking a course as complete, check if the whole campaign is complete
        all_courses_in_campaign = campaign_user.campaign.courses.all()
        
        # Count completed courses for this user in this campaign
        completed_courses_count = UserCourseProgress.objects.filter(
            campaign_user=campaign_user,
            completed=True
        ).count()

        if all_courses_in_campaign.count() > 0 and all_courses_in_campaign.count() == completed_courses_count:
            campaign_user.completed = True
            campaign_user.completed_at = timezone.now()
            campaign_user.save()

        return Response({"success": True, "message": "Course marked as completed."}, status=status.HTTP_200_OK)
        
    except LMSCampaignUser.DoesNotExist:
        return Response({"error": "You are not enrolled in this campaign."}, status=status.HTTP_404_NOT_FOUND)
    except Course.DoesNotExist:
        return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
