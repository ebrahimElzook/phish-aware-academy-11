from django.urls import path
from . import views

app_name = 'lms'

urlpatterns = [
    path('get_courses_for_company/', views.get_courses_for_company, name='get_courses_for_company'),
    path('get_users_for_company/', views.get_users_for_company, name='get_users_for_company'),
]
