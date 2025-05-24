from rest_framework import serializers
from .models import CSWordEmailServ, EmailTemplate
from accounts.models import Company

class CSWordEmailServSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSWordEmailServ
        fields = ['id', 'host', 'port', 'host_user', 'is_active']
        # Exclude host_password for security

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug']

class EmailTemplateSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EmailTemplate
        fields = ['id', 'subject', 'content', 'company', 'company_name', 'is_global']
    
    def get_company_name(self, obj):
        return obj.company.name if obj.company else None
