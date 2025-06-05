from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from courses.models import Course, Question
from accounts.models import Company, User
from .models import LMSCampaign, LMSCampaignUser
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
    print(f"[DEBUG] User requesting campaigns: {user.username} (ID: {user.id})")
    
    # Check if user is a Super Admin
    print(f"[DEBUG] User role: {getattr(user, 'role', 'No role attribute found')}")
    print(f"[DEBUG] User object attributes: {dir(user)}")
    
    # Try to determine if user is a Super Admin
    is_super_admin = False
    if hasattr(user, 'role'):
        # Check for 'SUPER_ADMIN' (correct case from User model)
        is_super_admin = user.role == 'SUPER_ADMIN'
        print(f"[DEBUG] Is super admin based on role: {is_super_admin}")
    elif hasattr(user, 'is_superuser'):
        is_super_admin = user.is_superuser
        print(f"[DEBUG] Is super admin based on is_superuser: {is_super_admin}")
    
    print(f"[DEBUG] Final is_super_admin determination: {is_super_admin}")
    
    # Get the user's company
    company = user.company
    print(f"[DEBUG] User's company: {company}")
    
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
    print(f"[DEBUG] Found {campaigns.count()} campaigns for company {company}")
    for c in campaigns:
        print(f"[DEBUG] Campaign: {c.id} - {c.name}")
    
    # Format data for response
    data = []
    print(f"[DEBUG] Formatting {campaigns.count()} campaigns for response")
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
            "course": campaign.course.name if campaign.course else "",
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
        course_id = data.get('course_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        selected_users = data.get('selected_users', [])
        
        # Validate required fields
        if not name or not course_id:
            return Response({"error": "Name and course are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the course
        try:
            course = Course.objects.get(id=course_id)
            # Verify course belongs to company
            if not course.companies.filter(id=company.id).exists():
                return Response({"error": "Course does not belong to your company"}, status=status.HTTP_400_BAD_REQUEST)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Create the campaign
        campaign = LMSCampaign.objects.create(
            name=name,
            course=course,
            company=company,
            created_by=user,
            start_date=start_date,
            end_date=end_date
        )
        
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
        # and where current date is between start_date and end_date
        user_campaign_relations = LMSCampaignUser.objects.filter(
            user=user,
            campaign__company=company
        ).select_related('campaign', 'campaign__course')
        
        # Filter campaigns by date if start_date and end_date are set
        active_campaigns = []
        for relation in user_campaign_relations:
            campaign = relation.campaign
            # Only include campaigns where current date is between start_date and end_date
            # If dates are not set, include the campaign
            if (campaign.start_date is None or campaign.start_date <= current_date) and \
               (campaign.end_date is None or campaign.end_date >= current_date):
                active_campaigns.append({
                    "relation": relation,
                    "campaign": campaign
                })
        
        # Format data for response
        data = []
        for item in active_campaigns:
            campaign = item["campaign"]
            relation = item["relation"]
            
            # Get course details
            course = campaign.course
            course_data = {
                "id": str(course.id),
                "title": course.name,
                "description": course.description,
                "thumbnail": request.build_absolute_uri(course.thumbnail.url) if course.thumbnail else "",
                "video": request.build_absolute_uri(course.video.url) if course.video else ""
            }
            
            # Format campaign data
            campaign_data = {
                "id": str(campaign.id),
                "title": campaign.name,
                "description": course.description,  # Using course description for now
                "dueDate": campaign.end_date.strftime("%Y-%m-%d") if campaign.end_date else "",
                "progress": 100 if relation.completed else (50 if relation.started else 0),
                "completed": relation.completed,
                "certificateAvailable": relation.completed,  # Only if completed
                "course": course_data,
                # Add any other fields needed for the frontend
            }
            data.append(campaign_data)
        
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
