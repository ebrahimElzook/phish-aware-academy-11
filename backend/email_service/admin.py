from django.contrib import admin
from django.db import models
from django.utils.safestring import mark_safe
from .models import CSWordEmailServ, EmailTemplate

@admin.register(CSWordEmailServ)
class CSWordEmailServAdmin(admin.ModelAdmin):
    list_display = ('host', 'port', 'host_user', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('host', 'host_user')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('host', 'port', 'host_user', 'host_password', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ('subject', 'difficulty', 'category', 'company', 'is_global', 'created_at', 'updated_at')
    list_filter = ('is_global', 'difficulty', 'category')
    search_fields = ('subject', 'content', 'company', 'category')
    readonly_fields = ('created_at', 'updated_at', 'content_preview')
    formfield_overrides = {
        models.TextField: {'widget': admin.widgets.AdminTextareaWidget(attrs={'rows': 15})},
    }
    
    fieldsets = (
        (None, {
            'fields': ('subject', 'content', 'content_preview')
        }),
        ('Classification', {
            'fields': ('difficulty', 'category')
        }),
        ('Availability', {
            'fields': ('company', 'is_global')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def content_preview(self, obj):
        """Display a preview of the HTML content"""
        if obj.content:
            return mark_safe(f'<div style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;">{obj.content}</div>')
        return "No content"
    content_preview.short_description = 'Content Preview'
