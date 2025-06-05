from rest_framework import serializers
from .models import CSWordEmailServ, EmailTemplate, PhishingCampaign
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


class PhishingCampaignSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True) # Use existing CompanySerializer for nested representation
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company', write_only=True
    )

    class Meta:
        model = PhishingCampaign
        fields = ['id', 'campaign_name', 'company', 'company_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
