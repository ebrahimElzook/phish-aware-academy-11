from django.urls import path
from . import views
from .email_utils import save_email
from .email_tracking import mark_email_read, mark_email_clicked
from .email_sender_updated import send_email
from .test_tracking import test_mark_read
from .email_status import get_sent_emails

urlpatterns = [
    path('send/', send_email, name='send_email'),
    path('save/', save_email, name='save_email'),
    path('mark-read/<int:email_id>/', mark_email_read, name='mark_email_read'),
    path('mark-clicked/<int:email_id>/', mark_email_clicked, name='mark_email_clicked'),
    path('test-read/<int:email_id>/', test_mark_read, name='test_mark_read'),
    path('configurations/', views.get_email_configurations, name='get_email_configurations'),
    path('templates/', views.get_email_templates, name='get_email_templates'),
    path('sent-emails/', get_sent_emails, name='get_sent_emails'),
]
