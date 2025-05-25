from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django import forms
from .models import User, Company, Department, Email

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)

class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If we have a user instance and it has a company, filter departments
        if self.instance and self.instance.pk and self.instance.company:
            self.fields['department'].queryset = Department.objects.filter(company=self.instance.company)
        elif 'company' in self.data:
            try:
                company_id = int(self.data.get('company'))
                self.fields['department'].queryset = Department.objects.filter(company_id=company_id)
            except (ValueError, TypeError):
                pass

class UserAdmin(BaseUserAdmin):
    form = UserAdminForm
    model = User
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'company', 'department', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'role', 'company', 'department')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('username', 'first_name', 'last_name')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Custom fields'), {'fields': ('role', 'company', 'department')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role', 'company', 'department'),
        }),
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    
    class Media:
        js = ('js/admin_user_form.js',)

admin.site.register(User, UserAdmin)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'created_at', 'updated_at')
    list_filter = ('company',)
    search_fields = ('name',)

@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ('subject', 'sender', 'recipient', 'sent', 'read', 'clicked', 'created_at', 'sent_at')
    list_filter = ('sent', 'read', 'clicked')
    search_fields = ('subject', 'content')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'sent_at')
    fieldsets = (
        (None, {'fields': ('subject', 'content', 'sender', 'recipient')}),
        (_('Status'), {'fields': ('sent', 'read', 'clicked')}),
        (_('Timestamps'), {'fields': ('created_at', 'sent_at')}),
    )
