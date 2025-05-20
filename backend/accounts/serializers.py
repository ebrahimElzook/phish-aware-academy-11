from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Company, Department

User = get_user_model()

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'company')

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'company', 'department', 'department_name', 'is_active')
        read_only_fields = ('id', 'role', 'company')
    
    def get_department_name(self, obj):
        if obj.department:
            return obj.department.name
        return None

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    company_name = serializers.CharField(write_only=True, required=False)
    company_description = serializers.CharField(write_only=True, required=False)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role', 'company_name', 'company_description', 'department')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        company_data = None
        if 'company_name' in validated_data:
            company_data = {
                'name': validated_data.pop('company_name'),
                'description': validated_data.pop('company_description', '')
            }

        user = User.objects.create_user(**validated_data)
        
        if company_data and user.role == User.Role.COMPANY_ADMIN:
            company = Company.objects.create(**company_data)
            user.company = company
            user.save(update_fields=['company'])
        
        return user
