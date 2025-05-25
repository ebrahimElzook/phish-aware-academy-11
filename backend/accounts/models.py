from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.utils import timezone

class Department(models.Model):
    name = models.CharField(max_length=100)
    company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='departments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['name', 'company']
    
    def __str__(self):
        return f"{self.name} ({self.company.name})"

class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin')
        COMPANY_ADMIN = 'COMPANY_ADMIN', _('Company Admin')
        USER = 'USER', _('User')
    
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER,
    )
    company = models.ForeignKey(
        'Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )
    email = models.EmailField(_('email address'), unique=True)
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_('Designates whether this user should be treated as active. '
                    'Unselect this instead of deleting accounts.')
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, help_text="URL-friendly name for company subdirectory")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
        
    def save(self, *args, **kwargs):
        # Auto-generate slug from name if not provided
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Email(models.Model):
    subject = models.CharField(max_length=255)
    content = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_emails')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_emails')
    sent = models.BooleanField(default=False)
    read = models.BooleanField(default=False)
    clicked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.subject} - From: {self.sender.email} To: {self.recipient.email}"
    
    def mark_as_sent(self):
        self.sent = True
        self.sent_at = timezone.now()
        self.save()
    
    def mark_as_read(self):
        self.read = True
        self.save()
    
    def mark_as_clicked(self):
        self.clicked = True
        self.save()
