from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from courses.models import Course
from accounts.models import Company, User


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
