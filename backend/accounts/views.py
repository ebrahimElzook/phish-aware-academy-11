from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import get_object_or_404
from .models import Company
from .serializers import (
    UserSerializer, 
    CompanySerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer
)

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User created successfully"
        }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        # Check if we're in a company-specific context
        company_slug = kwargs.get('company_slug')
        
        response = super().post(request, *args, **kwargs)
        
        # If we have a company slug, verify the user has access to this company
        if company_slug and response.status_code == 200:
            try:
                # Get the company
                company = Company.objects.get(slug=company_slug)
                
                # Get the user from the token response
                user_id = response.data.get('user', {}).get('id')
                user = User.objects.get(id=user_id)
                
                # Check if user belongs to this company or is a super admin
                if user.role != 'SUPER_ADMIN' and (not user.company or user.company.slug != company_slug):
                    return Response(
                        {"detail": "You don't have access to this company portal."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                # Add company info to the response
                response.data['company'] = {
                    'id': company.id,
                    'name': company.name,
                    'slug': company.slug
                }
                
            except Company.DoesNotExist:
                return Response(
                    {"detail": "Company not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return response

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, company_slug=None):
        # If company_slug is provided, check if user has access
        if company_slug:
            company = get_object_or_404(Company, slug=company_slug)
            
            # Check if user belongs to this company or is a super admin
            if request.user.role != 'SUPER_ADMIN' and (not request.user.company or request.user.company.id != company.id):
                return Response(
                    {"detail": "You don't have access to this company portal."},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CompanyListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, company_slug=None):
        # If company_slug is provided, check if user has access
        if company_slug:
            company = get_object_or_404(Company, slug=company_slug)
            
            # Check if user belongs to this company or is a super admin
            if request.user.role != 'SUPER_ADMIN' and (not request.user.company or request.user.company.id != company.id):
                return Response(
                    {"detail": "You don't have access to this company portal."},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Get the current and new password from request
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response(
                {"detail": "Both current password and new password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify current password
        user = request.user
        if not user.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
