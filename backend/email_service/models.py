from django.db import models

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
