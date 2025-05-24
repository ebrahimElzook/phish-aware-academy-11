from django.db import models
from accounts.models import Company

class CSWordEmailServ(models.Model):
    host = models.CharField(max_length=255, help_text="SMTP server host")
    port = models.IntegerField(help_text="SMTP server port")
    host_user = models.CharField(max_length=255, help_text="SMTP server username")
    host_password = models.CharField(max_length=255, help_text="SMTP server password")
    is_active = models.BooleanField(default=True, help_text="Whether this configuration is active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Email Service Configuration"
        verbose_name_plural = "Email Service Configurations"

    def __str__(self):
        return f"{self.host}:{self.port} ({self.host_user})"


class EmailTemplate(models.Model):
    subject = models.CharField(max_length=255, help_text="Email subject line")
    content = models.TextField(help_text="Email content/body")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=True, null=True, help_text="Company associated with this template")
    is_global = models.BooleanField(default=False, help_text="Whether this template is available globally to all companies")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Email Template"
        verbose_name_plural = "Email Templates"

    def __str__(self):
        return f"{self.subject} ({'Global' if self.is_global else self.company.name if self.company else 'No company'})"
