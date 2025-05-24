from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.send_email, name='send_email'),
    path('configurations/', views.get_email_configurations, name='get_email_configurations'),
    path('templates/', views.get_email_templates, name='get_email_templates'),
]
