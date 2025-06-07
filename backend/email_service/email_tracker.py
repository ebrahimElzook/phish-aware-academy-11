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
    
    # The tracking URL that will mark the click and then redirect
    view_in_browser_url = f"{tracking_url}/api/email/mark-clicked/{email_id}/?url={quote(f"{tracking_url}/api/email/view-in-browser/{email_id}/")}"
    
    # Log the tracking information for debugging
    logger.info(f"Added multiple tracking methods for email {email_id}: {tracking_url}/api/email/mark-read/{email_id}/")
    
    # Add all tracking methods at strategic locations in the body
    if '</body>' in body:
        # For HTML emails, add tracking elements before the closing body tag
        all_tracking = f"{tracking_pixel}{alt_tracking_pixel}{svg_tracking_pixel}{css_tracking}{tracking_link}{attr_tracking}{script_tracking}"
        
        # No View in Browser button added here anymore
        
        # Add tracking elements at the end
        body = body.replace('</body>', f'{all_tracking}</body>')
    else:
        # For plain text or non-HTML emails
        body = f"{body}{tracking_pixel}{alt_tracking_pixel}{svg_tracking_pixel}{css_tracking}{tracking_link}{attr_tracking}{script_tracking}"
    
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
    Modify all links in the email body to point to the 'View in Browser' page
    """
    if not email_id:
        print("No email_id provided, skipping link tracking")
        return body
        
    # Get the tracking URL from settings
    server_url = settings.EMAIL_TRACKING_URL
    print(f"Server URL: {server_url}")
    
    # Create the tracking URL that will mark the click and redirect
    tracking_url = f"{server_url}/api/email/mark-clicked/{email_id}/"
    view_in_browser_url = f"{server_url}/api/email/view-in-browser/{email_id}/"
    encoded_url = quote(view_in_browser_url, safe='')
    final_url = f"{tracking_url}?url={encoded_url}"
    
    print(f"Final tracking URL: {final_url}")
    
    # First, let's try to find all <a> tags and process them
    def process_links(html_content):
        from bs4 import BeautifulSoup
        
        print("Processing links with BeautifulSoup...")
        soup = BeautifulSoup(html_content, 'html.parser')
        
        for a_tag in soup.find_all('a', href=True):
            original_url = a_tag['href']
            print(f"Found link: {original_url}")
            
            # Only skip truly special URLs, but process '#' links
            if not original_url or original_url.startswith(('javascript:', 'mailto:', 'tel:')):
                print(f"Skipping special link: {original_url}")
                continue
                
            # Process '#' links by replacing them with our tracking URL
            if original_url == '#':
                print(f"Processing '#' link, replacing with tracking URL")
                
            # Update the href
            a_tag['href'] = final_url
            print(f"Updated link to: {final_url}")
        
        # Convert back to string
        result = str(soup)
        print("Final body preview:", result[:500])
        return result
    
    try:
        # Try using BeautifulSoup first
        return process_links(body)
    except Exception as e:
        print(f"Error processing with BeautifulSoup: {e}")
        print("Falling back to regex...")
        
        # Fallback to regex if BeautifulSoup fails
        def replace_href(match):
            before = match.group(1)  # Everything before href=
            quote_char = match.group(2) or '"'  # Quote character or default to "
            url = match.group(3)  # The URL
            after = match.group(4)  # Everything after the URL
            
            print(f"Regex found URL: {url}")
            
            if not url or url.startswith(('#', 'javascript:', 'mailto:', 'tel:')):
                print(f"Skipping special URL: {url}")
                return match.group(0)
                
            print(f"Replacing with: {final_url}")
            return f'{before}href="{final_url}"{after}'
        
        # Try different patterns
        patterns = [
            r'(<a[^>]*?\s+href=)(["\']?)([^"\'\s>]+)(\2)',  # With or without quotes
            r'(<a[^>]*?\s+href=)([^\s>]+)'  # Very permissive
        ]
        
        result = body
        for pattern in patterns:
            result = re.sub(pattern, replace_href, result, flags=re.IGNORECASE | re.DOTALL)
            
        print("Final body preview (regex):", result[:500])
        return result
