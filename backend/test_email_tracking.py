import os
import sys
import django
import uuid
import logging

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import Django models and services
from accounts.models import User, Email
from email_service.email_tracker import add_tracking_pixel, add_link_tracking
from django.conf import settings

def create_test_email():
    """Create a test email with tracking elements"""
    try:
        # Find or create test users
        sender_email = "test_sender@example.com"
        recipient_email = "test_recipient@example.com"
        
        sender, created = User.objects.get_or_create(
            email=sender_email,
            defaults={
                'username': f'test_sender_{uuid.uuid4().hex[:8]}',
                'first_name': 'Test',
                'last_name': 'Sender'
            }
        )
        if created:
            logger.info(f"Created test sender user: {sender.email}")
        
        recipient, created = User.objects.get_or_create(
            email=recipient_email,
            defaults={
                'username': f'test_recipient_{uuid.uuid4().hex[:8]}',
                'first_name': 'Test',
                'last_name': 'Recipient'
            }
        )
        if created:
            logger.info(f"Created test recipient user: {recipient.email}")
        
        # Create email content with links
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Test Email</title>
        </head>
        <body>
            <h1>Test Email for Tracking</h1>
            <p>This is a test email to verify tracking functionality.</p>
            <p>Click on <a href="https://example.com/test-link">this link</a> to test link tracking.</p>
            <p>Or visit our <a href="https://example.com/website">website</a> for more information.</p>
        </body>
        </html>
        """
        
        # Create the email in the database
        email = Email.objects.create(
            subject="Test Email Tracking",
            content=html_content,
            sender=sender,
            recipient=recipient,
            read=False
        )
        
        # Add tracking elements
        tracked_content = add_tracking_pixel(html_content, email.id)
        tracked_content = add_link_tracking(tracked_content, email.id)
        
        # Update the email with tracked content
        email.content = tracked_content
        email.save()
        
        logger.info(f"Created test email with ID: {email.id}")
        logger.info(f"Tracking URL base: {settings.EMAIL_TRACKING_URL}")
        
        # Print browser view URL
        browser_url = f"{settings.EMAIL_TRACKING_URL}/api/email/view-in-browser/{email.id}/"
        logger.info(f"Browser view URL: {browser_url}")
        
        return email
    
    except Exception as e:
        logger.error(f"Error creating test email: {str(e)}", exc_info=True)
        return None

if __name__ == "__main__":
    logger.info("Starting email tracking test")
    email = create_test_email()
    if email:
        logger.info(f"Test email created successfully with ID: {email.id}")
        backend_url = settings.BACKEND_URL
        logger.info(f"To view the email in browser, visit: {backend_url}/api/email/view-in-browser/{email.id}/")
        logger.info(f"To test pixel tracking, visit: {backend_url}/api/email/mark-read/{email.id}/?method=pixel")
    else:
        logger.error("Failed to create test email")
