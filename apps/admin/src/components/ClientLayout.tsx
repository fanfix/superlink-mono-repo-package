'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/Layout';
import { defaultAdminSidebarItems } from '../components/Sidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSidebarItemClick = (item: any) => {
    console.log('Clicked sidebar item:', item.id);
    if (item.href) {
      window.location.href = item.href;
    }
  };

  // Show layout only for dashboard and other admin pages
  const showLayout = isClient && (pathname === '/dashboard' || 
    pathname === '/users' || 
    pathname === '/bios' || 
    pathname === '/reports' || 
    pathname === '/admins' || 
    pathname === '/agencies' || 
    pathname === '/subscriptions' || 
    pathname === '/brand-kit-leads' || 
    pathname === '/superlockeds');

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (showLayout) {
    return (
      <DashboardLayout
        sidebarItems={defaultAdminSidebarItems}
        onSidebarItemClick={handleSidebarItemClick}
      >
        {children}
      </DashboardLayout>
    );
  }

  return <>{children}</>;
}
