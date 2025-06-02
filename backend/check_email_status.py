import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Import models
from accounts.models import Email

def check_email_status(email_id):
    try:
        email = Email.objects.get(id=email_id)
        print(f'Email ID: {email.id}')
        print(f'Subject: {email.subject}')
        print(f'Sender: {email.sender.email}')
        print(f'Recipient: {email.recipient.email}')
        print(f'Read Status: {email.read}')
        print(f'Created At: {email.created_at}')
        if email.read:
            print(f'Read At: {email.read_at}')
        return email
    except Email.DoesNotExist:
        print(f"Email with ID {email_id} does not exist")
        return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        email_id = sys.argv[1]
        check_email_status(email_id)
    else:
        print("Please provide an email ID as an argument")
        # List all emails
        print("\nListing all emails:")
        for email in Email.objects.all().order_by('-created_at')[:5]:
            print(f"ID: {email.id}, Subject: {email.subject}, Read: {email.read}")
