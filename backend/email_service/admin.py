from django.contrib import admin
from .models import CSWordEmailServ

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
