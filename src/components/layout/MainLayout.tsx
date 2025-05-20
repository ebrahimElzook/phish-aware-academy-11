import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from './MainNav';
import { UserNav } from './UserNav';
import { useAuth } from '@/contexts/AuthContext';

export const MainLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="font-bold text-xl mr-6">Phish Aware</div>
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            {user && (
              <UserNav user={user} onLogout={logout} />
            )}
          </div>
        </div>
      </div>
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
