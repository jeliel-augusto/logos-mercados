'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AdminAPI } from '../api/admin-api';
import { Admin } from '../models';

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [api] = useState(() => new AdminAPI());

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentAdmin = await api.getCurrentAdmin();
        setAdmin(currentAdmin);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [api]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      setAdmin(response.admin);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const currentAdmin = await api.getCurrentAdmin();
      setAdmin(currentAdmin);
    } catch (error) {
      console.error('Auth refresh failed:', error);
      setAdmin(null);
    }
  };

  const value: AuthContextType = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: api.isAuthenticated(),
    isSuperAdmin: api.isSuperAdmin(),
    refreshAuth,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
