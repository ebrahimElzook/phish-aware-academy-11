import re
from urllib.parse import quote
from django.conf import settings

def add_tracking_pixel(body, email_id):
    """
    Add a tracking pixel to the email body to track when it's opened
    """
    if not email_id:
        return body
        
    # Get the tracking URL from settings
    from django.conf import settings
    tracking_url = getattr(settings, 'EMAIL_TRACKING_URL', 'http://localhost:8000')
    
    # Create the tracking pixel with the full URL
    tracking_pixel = f'<img src="{tracking_url}/api/email/mark-read/{email_id}/" width="1" height="1" alt="" style="display:none;">'
    
    # Log the tracking pixel URL for debugging
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Added tracking pixel for email {email_id}: http://localhost:8000/api/email/mark-read/{email_id}/")
    
    # Add tracking pixel at the end of the body
    if '</body>' in body:
        body = body.replace('</body>', f'{tracking_pixel}</body>')
    else:
        body = f'{body}{tracking_pixel}'
    
    return body

def add_link_tracking(body, email_id):
    """
    Replace all links in the email body with tracking links
    that will record when they are clicked before redirecting
    """
    if not email_id:
        return body
        
    # Get the tracking URL from settings
    from django.conf import settings
    server_url = getattr(settings, 'EMAIL_TRACKING_URL', 'http://localhost:8000')
    
    # Regular expression to find links in HTML
    link_pattern = re.compile(r'<a\s+(?:[^>]*?\s+)?href=(["\'])(.*?)\1', re.IGNORECASE)
    
    # Get logger for debugging
    import logging
    logger = logging.getLogger(__name__)
    
    def replace_link(match):
        quote_char = match.group(1)  # The quote character used (" or ')
        original_url = match.group(2)  # The original URL
        
        # Skip anchor links and javascript links
        if original_url.startswith('#') or original_url.startswith('javascript:'):
            return match.group(0)
            
        # URL encode the original URL to use as a parameter
        encoded_url = quote(original_url)
        
        # Create the tracking URL
        tracking_url = f"{server_url}/api/email/mark-clicked/{email_id}/?url={encoded_url}"
        
        # Log the tracking URL for debugging
        logger.info(f"Added click tracking for email {email_id}, original URL: {original_url}, tracking URL: {tracking_url}")
        
        # Replace the original URL with the tracking URL
        return f'<a href={quote_char}{tracking_url}{quote_char}'
    
    # Replace all links in the body
    tracked_body = link_pattern.sub(replace_link, body)
    
    return tracked_body
