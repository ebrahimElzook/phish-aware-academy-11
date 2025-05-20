from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .company_views import CompanyListView

# Standard auth endpoints
auth_patterns = [
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('users/', views.CompanyListView.as_view(), name='user-list'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
]

# Company-specific auth endpoints
company_patterns = [
    path('token/', views.CustomTokenObtainPairView.as_view(), name='company_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='company_token_refresh'),
    path('profile/', views.UserProfileView.as_view(), name='company_profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='company_change_password'),
]

urlpatterns = [
    # Standard auth endpoints
    path('', include(auth_patterns)),
    
    # Company-specific endpoints
    path('<str:company_slug>/', include(company_patterns)),
    
    # Company listing endpoint
    path('companies/', CompanyListView.as_view(), name='company-list'),
]
