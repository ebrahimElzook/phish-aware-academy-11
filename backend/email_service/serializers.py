from rest_framework import serializers
from .models import CSWordEmailServ

class CSWordEmailServSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSWordEmailServ
        fields = ['id', 'host', 'port', 'host_user', 'is_active']
        # Exclude host_password for security
