import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const MainNav = () => {
  const location = useLocation();
  
  const items = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      href: "/templates",
      label: "Templates",
    },
    {
      href: "/users",
      label: "Users",
    },
    {
      href: "/reports",
      label: "Reports",
    },
  ];

  return (
    <nav className="flex items-center space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
