
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/routes';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace(ROUTES.DASHBOARD);
      } else {
        router.replace(ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Loading...
    </div>
  );
}
