import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { companyService } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

/**
 * A component that validates if a company exists before rendering its routes
 */
export const CompanyRoute = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidCompany, setIsValidCompany] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const validateCompany = async () => {
      if (!companySlug) {
        setIsValidating(false);
        return;
      }

      try {
        setIsValidating(true);
        const companies = await companyService.getCompanies();
        const companyExists = companies.some(company => company.slug === companySlug);
        
        setIsValidCompany(companyExists);
        
        if (!companyExists) {
          // Clear the stored company slug if it's invalid
          localStorage.removeItem('companySlug');
          
          toast({
            title: "Company Not Found",
            description: `The company "${companySlug}" does not exist.`,
            variant: "destructive",
          });
        } else {
          // Store valid company slug
          localStorage.setItem('companySlug', companySlug);
        }
      } catch (error) {
        console.error('Error validating company:', error);
        setIsValidCompany(false);
        
        toast({
          title: "Error",
          description: "Failed to validate company. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsValidating(false);
      }
    };

    validateCompany();
  }, [companySlug, toast]);

  if (isValidating) {
    // Show loading state while validating
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // If company is invalid, redirect to company selection
  if (!isValidCompany) {
    return <Navigate to="/select-company" replace />;
  }

  // If company is valid, render the child routes
  return <Outlet />;
};

export default CompanyRoute;
