from django.contrib import admin
from .models import LMSCampaign, LMSCampaignUser
from courses.models import Question, Course
from accounts.models import User


class LMSCampaignUserInline(admin.TabularInline):
    model = LMSCampaignUser
    extra = 1
    fields = ('user', 'started', 'completed', 'started_at', 'completed_at')
    readonly_fields = ('started_at', 'completed_at')
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'user':
            # Get the parent object (LMSCampaign) if it exists
            if request.resolver_match.kwargs.get('object_id'):
                campaign_id = request.resolver_match.kwargs.get('object_id')
                try:
                    campaign = LMSCampaign.objects.get(id=campaign_id)
                    # Filter users by the campaign's company
                    if campaign.company:
                        kwargs['queryset'] = User.objects.filter(company=campaign.company)
                    else:
                        kwargs['queryset'] = User.objects.all()
                except LMSCampaign.DoesNotExist:
                    kwargs['queryset'] = User.objects.all()
            else:
                # For new campaigns, don't restrict the queryset but let JavaScript handle the UI
                # This allows the form to validate properly while still using JS for the UI
                kwargs['queryset'] = User.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    class Media:
        js = ('admin/js/vendor/jquery/jquery.min.js', 'admin/js/jquery.init.js', 'js/lms_campaign_user_inline.js',)


class QuestionSelectInline(admin.TabularInline):
    model = LMSCampaign.questions.through
    extra = 1
    verbose_name = 'Question'
    verbose_name_plural = 'Selected Questions'


from django import forms
from django.contrib.admin.widgets import FilteredSelectMultiple

class LMSCampaignAdminForm(forms.ModelForm):
    class Meta:
        model = LMSCampaign
        fields = '__all__'
    
    class Media:
        js = ('admin/js/vendor/jquery/jquery.min.js', 'admin/js/jquery.init.js')
        
    def clean(self):
        cleaned_data = super().clean()
        company = cleaned_data.get('company')
        course = cleaned_data.get('course')
        
        # If company and course are selected, validate that the course belongs to the company
        if company and course:
            # Check if the course is associated with the company
            if not course.companies.filter(id=company.id).exists():
                self.add_error('course', 'This course is not available for the selected company.')
                
        return cleaned_data

# Update the LMSCampaignAdmin class

@admin.register(LMSCampaign)
class LMSCampaignAdmin(admin.ModelAdmin):
    form = LMSCampaignAdminForm
    list_display = ('name', 'get_courses', 'company', 'start_date', 'end_date', 'created_by', 'created_at')
    list_filter = ('company', 'courses', 'created_at')
    search_fields = ('name', 'courses__name', 'company__name')
    inlines = [QuestionSelectInline, LMSCampaignUserInline]
    exclude = ('questions',)  # Exclude questions field since we're using the inline
    filter_horizontal = ('courses',)  # Add this to enable a better UI for selecting multiple courses
    fieldsets = (
        (None, {
            'fields': ('name', 'company', 'courses', 'created_by')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date'),
            'classes': ('collapse',),
            'description': 'Set the campaign schedule (optional)'
        }),
    )
    
    def get_courses(self, obj):
        return ", ".join([course.name for course in obj.courses.all()[:3]]) + (
            f" and {obj.courses.count() - 3} more" if obj.courses.count() > 3 else "")
    get_courses.short_description = 'Courses'
    
    class Media:
        js = ('admin/js/vendor/jquery/jquery.min.js', 'admin/js/jquery.init.js', 'js/lms_campaign_admin.js')
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # If creating a new campaign, set the created_by field to the current user
        if obj is None:
            form.base_fields['created_by'].initial = request.user
        return form
    
    def get_readonly_fields(self, request, obj=None):
        # Make created_by read-only if the object already exists
        if obj:
            return ('created_by',)
        return ()
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'course':
            if request.resolver_match.kwargs.get('object_id'):
                # For existing objects, get the company and filter courses
                try:
                    campaign = self.get_object(request, request.resolver_match.kwargs.get('object_id'))
                    if campaign.company:
                        kwargs['queryset'] = Course.objects.filter(companies=campaign.company)
                    else:
                        kwargs['queryset'] = Course.objects.all()
                except (LMSCampaign.DoesNotExist, ValueError):
                    kwargs['queryset'] = Course.objects.all()
            else:
                # For new objects, don't restrict the queryset but let JavaScript handle the UI
                # This allows the form to validate properly while still using JS for the UI
                kwargs['queryset'] = Course.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(LMSCampaignUser)
class LMSCampaignUserAdmin(admin.ModelAdmin):
    list_display = ('get_user_email', 'campaign', 'started', 'completed', 'created_at')
    list_filter = ('campaign', 'started', 'completed', 'created_at')
    search_fields = ('user__email', 'user__username', 'campaign__name')
    readonly_fields = ('started_at', 'completed_at')
    fieldsets = (
        (None, {
            'fields': ('campaign', 'user')
        }),
        ('Status', {
            'fields': ('started', 'completed', 'started_at', 'completed_at')
        }),
    )
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'User Email'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'user':
            # If campaign is already selected, filter users by that campaign's company
            campaign_id = request.GET.get('campaign')
            if campaign_id:
                try:
                    campaign = LMSCampaign.objects.get(id=campaign_id)
                    if campaign.company:
                        kwargs['queryset'] = User.objects.filter(company=campaign.company)
                    else:
                        kwargs['queryset'] = User.objects.all()
                except LMSCampaign.DoesNotExist:
                    kwargs['queryset'] = User.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
