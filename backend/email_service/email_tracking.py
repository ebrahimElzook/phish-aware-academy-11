from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

class JsonResponseWithCors(JsonResponse):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('content_type', 'application/json')
        super().__init__(*args, **kwargs)
        self['Access-Control-Allow-Origin'] = '*'
        self['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        self['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
        self['Access-Control-Allow-Credentials'] = 'true'

@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def mark_email_read(request, email_id):
    """
    API endpoint to mark an email as read
    """
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = JsonResponseWithCors({}, status=200)
        return response
        
    try:
        from accounts.models import Email
        email = Email.objects.get(id=email_id)
        email.mark_as_read()
        
        return JsonResponseWithCors({
            'success': True,
            'message': f'Email {email_id} marked as read',
        })
    except Email.DoesNotExist:
        return JsonResponseWithCors({'error': 'Email not found'}, status=404)
    except Exception as e:
        return JsonResponseWithCors({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(['GET', 'OPTIONS'])
def mark_email_clicked(request, email_id):
    """
    API endpoint to mark an email as clicked
    """
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        response = JsonResponseWithCors({}, status=200)
        return response
        
    try:
        from accounts.models import Email
        email = Email.objects.get(id=email_id)
        email.mark_as_clicked()
        
        return JsonResponseWithCors({
            'success': True,
            'message': f'Email {email_id} marked as clicked',
        })
    except Email.DoesNotExist:
        return JsonResponseWithCors({'error': 'Email not found'}, status=404)
    except Exception as e:
        return JsonResponseWithCors({'error': str(e)}, status=500)
