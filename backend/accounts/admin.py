from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django import forms
from .models import User, Company, Department, Email

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)

# Simple form without dynamic filtering to avoid 500 errors in production
class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

# Simplified UserAdmin without custom Media class to avoid 500 errors
class UserAdmin(BaseUserAdmin):
    form = UserAdminForm
    model = User
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'role')
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

admin.site.register(User, UserAdmin)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'created_at', 'updated_at')
    list_filter = ('company',)
    search_fields = ('name',)

@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'sender', 'recipient', 'sent', 'read', 'clicked', 'created_at', 'sent_at')
    list_filter = ('sent', 'read', 'clicked')
    search_fields = ('subject', 'content', 'id')
    date_hierarchy = 'created_at'
    readonly_fields = ('id', 'created_at', 'sent_at')
    fieldsets = (
        (None, {'fields': ('id', 'subject', 'content', 'sender', 'recipient')}),
        (_('Status'), {'fields': ('sent', 'read', 'clicked')}),
        (_('Timestamps'), {'fields': ('created_at', 'sent_at')}),
    )
