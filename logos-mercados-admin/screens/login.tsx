'use client';

import { LoginForm } from '../components/auth/login-form';
import { AuthProvider } from '../lib/auth';

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
