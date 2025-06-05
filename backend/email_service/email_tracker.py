import re
import uuid
import random
import html
from urllib.parse import quote
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def add_tracking_pixel(body, email_id):
    """
    Add a tracking pixel to the email body to track when it's opened
    """
    if not email_id:
        return body
        
    # Get the tracking URL from settings
    tracking_url = settings.EMAIL_TRACKING_URL
    
    # Generate multiple unique identifiers to prevent caching
    unique_ids = [str(uuid.uuid4()) for _ in range(5)]
    timestamp = str(int(random.random() * 10000000))
    
    # Create multiple tracking pixels with different approaches
    # Standard tracking pixel
    tracking_pixel = f'<img src="{tracking_url}/api/email/mark-read/{email_id}/?uid={unique_ids[0]}&method=pixel1&t={timestamp}" width="1" height="1" alt="" style="display:none;">'
    
    # Alternative tracking pixel with different attributes to bypass some filters
    alt_tracking_pixel = f'<img src="{tracking_url}/api/email/mark-read/{email_id}/?uid={unique_ids[1]}&method=pixel2&t={timestamp}" width="1" height="1" border="0" alt="" style="display:block;">'
    
    # Create a tracking pixel with SVG MIME type
    svg_tracking_pixel = f'<img src="{tracking_url}/api/email/mark-read/{email_id}/?uid={unique_ids[2]}&method=svg&t={timestamp}" width="1" height="1" alt="" style="display:none;">'
    
    # Create a CSS-based tracking method
    css_tracking = f'<div style="background-image:url({tracking_url}/api/email/mark-read/{email_id}/?uid={unique_ids[3]}&method=css&t={timestamp});width:1px;height:1px;"></div>'
    
    # Create a fallback tracking method with a hidden link
    tracking_link = f'<a href="{tracking_url}/api/email/mark-read/{email_id}/?uid={unique_ids[4]}&method=link&t={timestamp}" style="display:none;font-size:1px;color:transparent;">.</a>'
    
    # Create a tracking method using HTML attributes
    attr_tracking = f'<div data-src="{tracking_url}/api/email/mark-read/{email_id}/?uid={unique_ids[0]}&method=attr&t={timestamp}" style="display:none;"></div>'
    
    # Create a tracking method using a script tag (for clients that allow scripts)
    script_tracking = f'<script>var img = new Image(); img.src = "{tracking_url}/api/email/mark-read/{email_id}/?uid={unique_ids[1]}&method=script&t={timestamp}";</script>'
    
    # Create a prominent "View in Browser" button that will reliably track opens
    # The actual URL where the email content will be displayed
    actual_view_url = f"{tracking_url}/api/email/view-in-browser/{email_id}/"
    # URL-encode it to pass as a query parameter
    encoded_actual_view_url = quote(actual_view_url)
    # The tracking URL that will mark the click and then redirect
    view_in_browser_url = f"{tracking_url}/api/email/mark-clicked/{email_id}/?url={encoded_actual_view_url}"
    view_in_browser_button = f'''
    <div style="text-align:center;margin:15px 0;">
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
            <tr>
                <td style="background-color:#4CAF50;border-radius:4px;padding:0;">
                    <a href="{view_in_browser_url}" style="display:inline-block;color:white;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:10px 20px;border-radius:4px;">
                        View Email in Browser
                    </a>
                </td>
            </tr>
        </table>
        <div style="font-size:12px;color:#666;margin-top:5px;">Having trouble viewing this email? Click the button above.</div>
    </div>
    '''
    
    # Log the tracking information for debugging
    logger.info(f"Added multiple tracking methods for email {email_id}: {tracking_url}/api/email/mark-read/{email_id}/")
    
    # Add all tracking methods at strategic locations in the body
    if '</body>' in body:
        # For HTML emails, add tracking elements before the closing body tag
        all_tracking = f"{tracking_pixel}{alt_tracking_pixel}{svg_tracking_pixel}{css_tracking}{tracking_link}{attr_tracking}{script_tracking}"
        
        # Add the View in Browser button at the top of the email
        if '<body' in body:
            body_tag_end = body.find('>', body.find('<body')) + 1
            if body_tag_end > 0:
                body = body[:body_tag_end] + view_in_browser_button + body[body_tag_end:]
        
        # Add tracking elements at the end
        body = body.replace('</body>', f'{all_tracking}</body>')
    else:
        # For plain text or non-HTML emails
        body = f"{view_in_browser_button}{body}{tracking_pixel}{alt_tracking_pixel}{svg_tracking_pixel}{css_tracking}{tracking_link}{attr_tracking}{script_tracking}"
    
    # Add tracking at various points in the email to increase chances of detection
    # Add at the beginning
    if '<body' in body:
        body_tag_end = body.find('>', body.find('<body')) + 1
        if body_tag_end > 0:
            body = body[:body_tag_end] + tracking_pixel + body[body_tag_end:]
    
    # Try to add after the first div or paragraph if possible
    for tag in ['</div>', '</p>', '</table>']:
        if tag in body:
            first_tag_pos = body.find(tag) + len(tag)
            if first_tag_pos > 0:
                body = body[:first_tag_pos] + alt_tracking_pixel + body[first_tag_pos:]
                break
    
    return body

def add_link_tracking(body, email_id):
    """
    Replace all links in the email body with tracking links
    that will record when they are clicked before redirecting
    """
    if not email_id:
        return body
        
    # Get the tracking URL from settings
    server_url = settings.EMAIL_TRACKING_URL
    
    # Regular expression to find links in HTML
    link_pattern = re.compile(r'<a\s+(?:[^>]*?\s+)?href=(["\'])(.*?)\1', re.IGNORECASE)
    
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
