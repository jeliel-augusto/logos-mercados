'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Loader } from '@mantine/core';
import { AuthProvider, useAuth } from '../lib/auth';

function HomeContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Container size="xl" py="md">
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader size="lg" />
        </div>
      </Container>
    );
  }

  return null;
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
