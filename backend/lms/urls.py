from django.urls import path
from . import views

app_name = 'lms'

urlpatterns = [
    path('get_courses_for_company/', views.get_courses_for_company, name='get_courses_for_company'),
    path('get_users_for_company/', views.get_users_for_company, name='get_users_for_company'),
    path('api/campaigns/', views.get_lms_campaigns, name='get_lms_campaigns'),
    path('api/campaigns/create/', views.create_lms_campaign, name='create_lms_campaign'),
    path('api/user-campaigns/', views.get_user_campaigns, name='get_user_campaigns'),
]
