from django.core.mail import send_mail, get_connection, EmailMultiAlternatives
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import CSWordEmailServ, EmailTemplate, PhishingCampaign
from .serializers import CSWordEmailServSerializer, EmailTemplateSerializer, PhishingCampaignSerializer
from accounts.models import Email, User, Company, Department # Added Company and Department import
from django.db.models import Count, Q, Avg, F, ExpressionWrapper, FloatField, Case, When
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from .serializers import (CSWordEmailServSerializer, EmailTemplateSerializer, 
                          PhishingCampaignSerializer, PhishingSummaryStatsSerializer,
                          DepartmentPerformanceSerializer, TemporalTrendPointSerializer)
import json
import logging
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class JsonResponseWithCors(JsonResponse):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('content_type', 'application/json')
        kwargs.setdefault('safe', False)  # Allow non-dict objects to be serialized
        super().__init__(*args, **kwargs)
        self['Access-Control-Allow-Origin'] = settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else '*'
        self['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'  # Added GET to allowed methods
        self['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken, Authorization'  # Added Authorization header
        self['Access-Control-Allow-Credentials'] = 'true'

@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def send_email(request):
    if request.method == 'OPTIONS':
        response = JsonResponseWithCors({}, status=200)
        return response
    
    try:
        logger.info(f"Received email request with body: {request.body}")
        
        # Parse JSON data
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return JsonResponseWithCors(
                {'error': 'Invalid JSON format'}, 
                status=400
            )
        
        # Extract and validate required fields
        to_email = data.get('to')
        from_email = data.get('from')
        subject = data.get('subject')
        body = data.get('body')
        email_id = data.get('email_id')  # Optional email_id if saved before sending
        
        # Validate required fields
        if not all([to_email, from_email, subject, body]):
            missing = [field for field in ['to', 'from', 'subject', 'body'] 
                     if not data.get(field)]
            error_msg = f'Missing required fields: {", ".join(missing)}'
            logger.warning(error_msg)
            return JsonResponseWithCors(
                {'error': error_msg}, 
                status=400
            )
        
        logger.info(f"Sending email from {from_email} to {to_email} with subject: {subject}")
        
        # Get active email configuration from database
        try:
            email_config = CSWordEmailServ.objects.filter(is_active=True).first()
            
            if not email_config:
                logger.error("No active email configuration found in database")
                return JsonResponseWithCors(
                    {'error': 'No active email configuration found'}, 
                    status=500
                )
                
            # Create connection with database settings
            connection = get_connection(
                host=email_config.host,
                port=email_config.port,
                username=email_config.host_user,
                password=email_config.host_password,
                use_tls=settings.EMAIL_USE_TLS,
            )
            
            # Use the host_user from database as the sender email if from_email is not provided
            if not from_email or from_email == 'default':
                from_email = email_config.host_user
            
            # Add tracking pixel to HTML content if email_id is provided
            if email_id:
                # Get the base URL from settings
                base_url = settings.BACKEND_URL
                tracking_pixel = f'<img src="{base_url}/api/email/mark-read/{email_id}/" width="1" height="1" alt="" style="display:none;">\n'                
                # Add tracking pixel at the end of the body
                if '</body>' in body:
                    body = body.replace('</body>', f'{tracking_pixel}</body>')
                else:
                    body = f'{body}{tracking_pixel}'
            
            # Create a plain text version of the message (fallback for email clients that don't support HTML)
            plain_text_message = body.replace('<br>', '\n').replace('<p>', '').replace('</p>', '\n\n')
            plain_text_message = ''.join(BeautifulSoup(plain_text_message, 'html.parser').findAll(text=True))
            
            # Create email message with both text and HTML versions
            email = EmailMultiAlternatives(
                subject=subject,
                body=plain_text_message,  # Plain text version
                from_email=from_email,
                to=[to_email],
                connection=connection,
            )
            
            # Attach HTML version
            email.attach_alternative(body, "text/html")
            
            # Send the email
            email.send(fail_silently=False)
            logger.info(f"Successfully sent email to {to_email}")
            
            # If this email was saved in the database, mark it as sent
            if email_id:
                try:
                    from accounts.models import Email
                    saved_email = Email.objects.get(id=email_id)
                    saved_email.mark_as_sent()
                    logger.info(f"Marked email with ID {email_id} as sent")
                except Exception as e:
                    logger.error(f"Error marking email as sent: {str(e)}")
            
            return JsonResponseWithCors({
                'success': True,
                'message': 'Email sent successfully',
                'to': to_email,
                'from': from_email,
                'subject': subject,
                'email_id': email_id
            })
            
        except Exception as e:
            error_msg = f"Error sending email: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return JsonResponseWithCors(
                {'error': error_msg},
                status=500
            )
    
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return JsonResponseWithCors(
            {'error': 'An unexpected error occurred'},
            status=500
        )

@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def get_email_configurations(request):
    """
    API endpoint to get all email configurations for the frontend dropdown menu
    """
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = JsonResponseWithCors({}, status=200)
        return response
        
    try:
        email_configs = CSWordEmailServ.objects.all()
        serializer = CSWordEmailServSerializer(email_configs, many=True)
        return JsonResponseWithCors(serializer.data, safe=False)
    except Exception as e:
        return JsonResponseWithCors({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def get_email_templates(request):
    """
    API endpoint to get email templates based on global flag and company
    """
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = JsonResponseWithCors({}, status=200)
        return response
        
    try:
        # Get company slug from query parameters
        company_slug = request.GET.get('company_slug', None)
        
        # If company_slug is provided, filter templates by company or global flag
        if company_slug:
            # Get templates that are either global or belong to the specified company
            from accounts.models import Company
            try:
                company = Company.objects.get(slug=company_slug)
                templates = EmailTemplate.objects.filter(is_global=True) | \
                           EmailTemplate.objects.filter(company=company)
            except Company.DoesNotExist:
                # If company doesn't exist, return only global templates
                templates = EmailTemplate.objects.filter(is_global=True)
        else:
            # If no company_slug is provided, return all templates (original logic)
            templates = EmailTemplate.objects.all()
            
        serializer = EmailTemplateSerializer(templates, many=True)
        return JsonResponseWithCors(serializer.data, safe=False)
    except Exception as e:
        return JsonResponseWithCors({'error': str(e)}, status=500)


@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def create_phishing_campaign_by_slug(request):
    if request.method == 'OPTIONS':
        return JsonResponseWithCors({}, status=200)

    try:
        data = request.data
        campaign_name = data.get('campaign_name')
        company_slug = data.get('company_slug')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if not all([campaign_name, company_slug, start_date, end_date]):
            missing_fields = []
            if not campaign_name: missing_fields.append('campaign_name')
            if not company_slug: missing_fields.append('company_slug')
            if not start_date: missing_fields.append('start_date')
            if not end_date: missing_fields.append('end_date')
            return JsonResponseWithCors(
                {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                status=400
            )

        try:
            company = Company.objects.get(slug=company_slug)
        except Company.DoesNotExist:
            logger.error(f"Company with slug '{company_slug}' not found.")
            return JsonResponseWithCors(
                {'error': f'Company with slug "{company_slug}" not found.'},
                status=404
            )

        campaign = PhishingCampaign.objects.create(
            campaign_name=campaign_name,
            company=company,
            start_date=start_date,
            end_date=end_date
        )
        serializer = PhishingCampaignSerializer(campaign)
        logger.info(f"Successfully created phishing campaign '{campaign_name}' for company '{company.name}'.")
        return JsonResponseWithCors(serializer.data, status=201)

    except json.JSONDecodeError:
        logger.error("Invalid JSON format for creating campaign.")
        return JsonResponseWithCors({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        logger.error(f"Error creating phishing campaign: {str(e)}", exc_info=True)
        return JsonResponseWithCors({'error': f'Error creating phishing campaign: {str(e)}'}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def phishing_analytics_summary(request):
    company = request.user.company
    if not company:
        # Return empty data structure instead of error
        summary_data = {
            'total_campaigns': 0,
            'total_emails_sent': 0,
            'total_emails_clicked': 0,
            'total_emails_read': 0,
            'average_click_rate': 0,
            'average_read_rate': 0,
        }
        serializer = PhishingSummaryStatsSerializer(summary_data)
        return JsonResponseWithCors(serializer.data)

    campaigns = PhishingCampaign.objects.filter(company=company)
    emails_qs = Email.objects.filter(phishing_campaign__in=campaigns, sent=True)

    total_campaigns = campaigns.count()
    total_emails_sent = emails_qs.count()
    total_emails_clicked = emails_qs.filter(clicked=True).count()
    total_emails_read = emails_qs.filter(read=True).count()

    average_click_rate = (total_emails_clicked / total_emails_sent * 100) if total_emails_sent > 0 else 0
    average_read_rate = (total_emails_read / total_emails_sent * 100) if total_emails_sent > 0 else 0

    summary_data = {
        'total_campaigns': total_campaigns,
        'total_emails_sent': total_emails_sent,
        'total_emails_clicked': total_emails_clicked,
        'total_emails_read': total_emails_read,
        'average_click_rate': round(average_click_rate, 2),
        'average_read_rate': round(average_read_rate, 2),
    }
    serializer = PhishingSummaryStatsSerializer(summary_data)
    return JsonResponseWithCors(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_performance_analytics(request):
    company = request.user.company
    if not company:
        # Return empty array instead of error
        return JsonResponseWithCors([])

    departments = Department.objects.filter(company=company)
    # Include users with no department
    departments_data = []

    # Handle users with no department
    users_no_department = User.objects.filter(company=company, department__isnull=True)
    emails_no_dept_qs = Email.objects.filter(
        phishing_campaign__company=company, 
        recipient__in=users_no_department, 
        sent=True
    )
    sent_no_dept = emails_no_dept_qs.count()
    clicked_no_dept = emails_no_dept_qs.filter(clicked=True).count()
    read_no_dept = emails_no_dept_qs.filter(read=True).count()

    if sent_no_dept > 0:
        departments_data.append({
            'department_id': None,
            'department_name': 'No Department',
            'emails_sent': sent_no_dept,
            'emails_clicked': clicked_no_dept,
            'emails_read': read_no_dept,
            'click_rate': round((clicked_no_dept / sent_no_dept * 100) if sent_no_dept > 0 else 0, 2),
            'read_rate': round((read_no_dept / sent_no_dept * 100) if sent_no_dept > 0 else 0, 2),
        })

    for dept in departments:
        users_in_dept = User.objects.filter(department=dept)
        emails_qs = Email.objects.filter(
            phishing_campaign__company=company, 
            recipient__in=users_in_dept, 
            sent=True
        )
        sent_count = emails_qs.count()
        clicked_count = emails_qs.filter(clicked=True).count()
        read_count = emails_qs.filter(read=True).count()

        if sent_count > 0: # Only add department if emails were sent to them
            departments_data.append({
                'department_id': dept.id,
                'department_name': dept.name,
                'emails_sent': sent_count,
                'emails_clicked': clicked_count,
                'emails_read': read_count,
                'click_rate': round((clicked_count / sent_count * 100) if sent_count > 0 else 0, 2),
                'read_rate': round((read_count / sent_count * 100) if sent_count > 0 else 0, 2),
            })

    serializer = DepartmentPerformanceSerializer(departments_data, many=True)
    return JsonResponseWithCors(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def phishing_temporal_trend_analytics(request):
    company = request.user.company
    if not company:
        # Return empty array instead of error
        return JsonResponseWithCors([])

    time_range_param = request.GET.get('range', '6months') # e.g., 3months, 6months, 1year
    end_date = datetime.now()
    if time_range_param == '3months':
        start_date = end_date - timedelta(days=3*30)
    elif time_range_param == '1year':
        start_date = end_date - timedelta(days=365)
    else: # Default to 6 months
        start_date = end_date - timedelta(days=6*30)

    emails_qs = Email.objects.filter(
        phishing_campaign__company=company,
        sent=True,
        sent_at__gte=start_date,
        sent_at__lte=end_date
    ).annotate(month=TruncMonth('sent_at')).values('month').annotate(
        total_sent=Count('id'),
        total_clicked=Count(Case(When(clicked=True, then=1))),
        total_read=Count(Case(When(read=True, then=1)))
    ).order_by('month')

    trend_data = []
    for monthly_stat in emails_qs:
        click_rate = (monthly_stat['total_clicked'] / monthly_stat['total_sent'] * 100) if monthly_stat['total_sent'] > 0 else 0
        read_rate = (monthly_stat['total_read'] / monthly_stat['total_sent'] * 100) if monthly_stat['total_sent'] > 0 else 0
        trend_data.append({
            'period': monthly_stat['month'].strftime('%Y-%m'),
            'click_rate': round(click_rate, 2),
            'read_rate': round(read_rate, 2),
        })

    serializer = TemporalTrendPointSerializer(trend_data, many=True)
    return JsonResponseWithCors(serializer.data)
