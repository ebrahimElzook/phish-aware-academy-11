import random
import logging
from django.core.mail import EmailMultiAlternatives, get_connection
from django.conf import settings
from bs4 import BeautifulSoup
from .models import CSWordEmailServ
from accounts.models import Email
from .email_tracker import add_tracking_pixel, add_link_tracking

logger = logging.getLogger(__name__)

def send_queued_email_job():
    logger.info('Scheduled email job started.')
    selected_email_id_for_logging = 'N/A'
    try:
        # Get active email configuration from database
        email_config = CSWordEmailServ.objects.filter(is_active=True).first()
        if not email_config:
            logger.error('No active email configuration found in database for scheduled job.')
            return

        # Get all unsent emails
        unsent_emails = Email.objects.filter(sent=False)
        if not unsent_emails.exists():
            logger.info('No unsent emails to process.')
            return

        # Select one random email
        selected_email = random.choice(list(unsent_emails))
        selected_email_id_for_logging = selected_email.id
        
        logger.info(f"Processing email ID: {selected_email_id_for_logging} for recipient: {selected_email.recipient.email}")

        to_email = selected_email.recipient.email
        from_email = email_config.host_user
        subject = selected_email.subject
        body = selected_email.content # This is the HTML body

        # Add tracking to HTML content using the email's ID
        body_with_tracking = add_link_tracking(body, str(selected_email_id_for_logging))
        body_with_tracking = add_tracking_pixel(body_with_tracking, str(selected_email_id_for_logging))

        # Create a plain text version of the message
        plain_text_message = body_with_tracking.replace('<br>', '\n').replace('<p>', '').replace('</p>', '\n\n')
        plain_text_message = ''.join(BeautifulSoup(plain_text_message, 'html.parser').findAll(text=True))

        # Create connection with database settings
        connection = get_connection(
            host=email_config.host,
            port=email_config.port,
            username=email_config.host_user,
            password=email_config.host_password,
            use_tls=getattr(settings, 'EMAIL_USE_TLS', True), # Default to True if not in settings
        )

        # Create email message with both text and HTML versions
        email_message = EmailMultiAlternatives(
            subject=subject,
            body=plain_text_message,  # Plain text version
            from_email=from_email,
            to=[to_email],
            connection=connection,
        )
        
        # Attach HTML version
        email_message.attach_alternative(body_with_tracking, "text/html")
        
        # Send the email
        email_message.send(fail_silently=False)
        logger.info(f"Successfully sent scheduled email ID: {selected_email_id_for_logging} to {to_email}")
        
        # Mark the email as sent in the database
        selected_email.mark_as_sent()
        logger.info(f"Marked email ID: {selected_email_id_for_logging} as sent in database.")

    except Email.DoesNotExist:
        logger.warning(f"Email ID {selected_email_id_for_logging} not found, possibly deleted before sending.")
    except Exception as e:
        logger.error(f"Error in scheduled email job for email ID {selected_email_id_for_logging}: {str(e)}", exc_info=True)
    finally:
        logger.info('Scheduled email job finished.')

