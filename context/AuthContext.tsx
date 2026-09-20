'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<User>;
  completeOnboardingStatus: (updatedUserProps: Partial<User>) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  isOnboardingModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'spendwise_user_session';

const MOCK_USER: User = {
  id: 'usr-101',
  name: 'Akash Gupta',
  email: 'akash@example.com',
  currency: 'INR',
  paydayDate: 1,
  baseSalary: 35000,
  isOnboarded: true,
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default demo session for immediate exploration
        setUser(MOCK_USER);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(MOCK_USER));
      }
    } catch (err) {
      console.error('Failed to load user session', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Simulated auth authentication
    const nameFromEmail = email.split('@')[0];
    const loggedInUser: User = {
      id: 'usr-' + Date.now(),
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email: email,
      currency: 'INR',
      paydayDate: 1,
      baseSalary: 35000,
      isOnboarded: true,
      createdAt: new Date().toISOString(),
    };
    setUser(loggedInUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedInUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = async (name: string, email: string, pass: string): Promise<User> => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name,
      email: email,
      currency: 'INR',
      paydayDate: 1,
      baseSalary: 0,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(true);
    return newUser;
  };

  const completeOnboardingStatus = (updatedUserProps: Partial<User>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      ...updatedUserProps,
      isOnboarded: true,
    };
    setUser(updated);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    setIsOnboardingModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOnboarded: user ? user.isOnboarded : false,
        isLoading,
        login,
        signup,
        completeOnboardingStatus,
        logout,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen,
        openOnboardingModal: () => setIsOnboardingModalOpen(true),
        closeOnboardingModal: () => setIsOnboardingModalOpen(false),
        isOnboardingModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
