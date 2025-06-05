from django.db import models
from accounts.models import Company, User
from courses.models import Course, Question


class LMSCampaign(models.Model):
    """Model for LMS campaigns that assign courses to users"""
    name = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lms_campaigns')
    questions = models.ManyToManyField(Question, related_name='lms_campaigns')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='lms_campaigns')
    start_date = models.DateField(null=True, blank=True, help_text="Start date of the campaign")
    end_date = models.DateField(null=True, blank=True, help_text="End date of the campaign")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_lms_campaigns')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'LMS Campaign'
        verbose_name_plural = 'LMS Campaigns'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.course.name}"


class LMSCampaignUser(models.Model):
    """Model for users assigned to LMS campaigns"""
    campaign = models.ForeignKey(LMSCampaign, on_delete=models.CASCADE, related_name='campaign_users')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lms_campaign_participations')
    started = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'LMS Campaign User'
        verbose_name_plural = 'LMS Campaign Users'
        unique_together = ['campaign', 'user']
    
    def __str__(self):
        return f"{self.user.email} - {self.campaign.name}"
        
    def save(self, *args, **kwargs):
        # Ensure the user belongs to the same company as the campaign
        if self.user.company != self.campaign.company:
            raise ValueError("User must belong to the same company as the campaign")
        super().save(*args, **kwargs)
