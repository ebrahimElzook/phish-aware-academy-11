from django.core.mail import send_mail, get_connection, EmailMultiAlternatives
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import CSWordEmailServ, EmailTemplate
from .serializers import CSWordEmailServSerializer, EmailTemplateSerializer
from accounts.models import Email, User
import json
import logging
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class JsonResponseWithCors(JsonResponse):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('content_type', 'application/json')
        super().__init__(*args, **kwargs)
        self['Access-Control-Allow-Origin'] = settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else '*'
        self['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        self['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
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
            # If no company_slug is provided, return all templates
            templates = EmailTemplate.objects.all()
            
        serializer = EmailTemplateSerializer(templates, many=True)
        return JsonResponseWithCors(serializer.data, safe=False)
    except Exception as e:
        return JsonResponseWithCors({'error': str(e)}, status=500)
