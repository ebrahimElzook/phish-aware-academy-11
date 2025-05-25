from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, JsonResponse
import logging
import base64

logger = logging.getLogger(__name__)

class JsonResponseWithCors(JsonResponse):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('content_type', 'application/json')
        super().__init__(*args, **kwargs)
        self['Access-Control-Allow-Origin'] = '*'
        self['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        self['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
        self['Access-Control-Allow-Credentials'] = 'true'

# 1x1 transparent pixel in base64 format
TRANSPARENT_PIXEL = base64.b64decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def mark_email_read(request, email_id):
    """
    API endpoint to mark an email as read and return a transparent pixel
    This is triggered automatically when the email is opened in most email clients
    """
    # Log all incoming requests for debugging
    logger.info(f"Received read tracking request for email_id: {email_id}, request: {request.method} {request.path}")
    
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = HttpResponse()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
        response['Access-Control-Allow-Credentials'] = 'true'
        return response
        
    try:
        # Import here to avoid circular imports
        from accounts.models import Email
        
        # Try to get and update the email
        try:
            # Log the attempt to find the email
            logger.info(f"Looking up email with ID: {email_id}")
            
            # Get the email from the database
            email = Email.objects.get(id=email_id)
            
            # Log that we found the email
            logger.info(f"Found email: {email.id}, subject: {email.subject}, current read status: {email.read}")
            
            # Mark it as read if it's not already
            if not email.read:
                email.mark_as_read()
                logger.info(f"Email {email_id} marked as read via tracking pixel")
            else:
                logger.info(f"Email {email_id} was already marked as read")
                
        except Email.DoesNotExist:
            logger.warning(f"Attempted to mark non-existent email {email_id} as read")
        except Exception as e:
            logger.error(f"Error marking email {email_id} as read: {str(e)}", exc_info=True)
        
        # Always return the tracking pixel image, even if there was an error
        # This ensures the email client doesn't show a broken image
        logger.info(f"Returning tracking pixel for email {email_id}")
        response = HttpResponse(TRANSPARENT_PIXEL, content_type='image/gif')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
        
    except Exception as e:
        logger.error(f"Unexpected error in mark_email_read: {str(e)}", exc_info=True)
        # Still return a pixel to avoid broken images in the email
        response = HttpResponse(TRANSPARENT_PIXEL, content_type='image/gif')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def mark_email_clicked(request, email_id):
    """
    API endpoint to mark an email as clicked and redirect to the target URL
    This is triggered when a user clicks on a tracked link in the email
    """
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = HttpResponse()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
        response['Access-Control-Allow-Credentials'] = 'true'
        return response
        
    # Get the redirect URL from the query parameters
    redirect_url = request.GET.get('url', '')
    
    try:
        from accounts.models import Email
        try:
            email = Email.objects.get(id=email_id)
            email.mark_as_clicked()
            logger.info(f"Email {email_id} marked as clicked")
        except Email.DoesNotExist:
            logger.warning(f"Attempted to mark non-existent email {email_id} as clicked")
        except Exception as e:
            logger.error(f"Error marking email {email_id} as clicked: {str(e)}")
        
        # If a redirect URL was provided, redirect to it
        if redirect_url:
            from django.shortcuts import redirect
            return redirect(redirect_url)
        
        # Otherwise, return a transparent pixel
        response = HttpResponse(TRANSPARENT_PIXEL, content_type='image/gif')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
        
    except Exception as e:
        logger.error(f"Unexpected error in mark_email_clicked: {str(e)}")
        # If there was an error but we have a redirect URL, still redirect
        if redirect_url:
            from django.shortcuts import redirect
            return redirect(redirect_url)
        
        # Otherwise return a pixel
        response = HttpResponse(TRANSPARENT_PIXEL, content_type='image/gif')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response
