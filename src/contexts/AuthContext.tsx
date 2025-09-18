import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService, type User, type LoginRequest, type RegisterRequest } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  
  console.log('🔵 AuthProvider render - user:', user, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const savedUser = authService.getCurrentUser();
        
        console.log('🔵 Initializing auth - Token exists:', !!token, 'Saved user:', !!savedUser);
        
        if (token && savedUser) {
          // First restore user from localStorage immediately
          setUser(savedUser);
          
          // Then try to validate token with API (optional)
          try {
            const userData = await authService.getProfile();
            console.log('🔵 Token validation successful, updating user data');
            setUser(userData);
          } catch (apiError) {
            console.log('🟡 Token validation failed:', apiError);
            // Keep the cached user, don't logout on API failure
            // Only logout if token is actually invalid (401 error)
            if (apiError instanceof Error && (
              apiError.message.includes('401') || 
              apiError.message.includes('invalid') || 
              apiError.message.includes('expired')
            )) {
              console.log('🔴 Token is invalid, logging out');
              authService.logout();
              setUser(null);
            } else {
              console.log('🟡 Keeping cached user due to network/backend error');
            }
          }
        }
      } catch (error) {
        console.error('🔴 Failed to initialize auth:', error);
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw to handle in component
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw to handle in component
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      if (
        error instanceof Error &&
        (error.message.includes('401') ||
          error.message.toLowerCase().includes('invalid') ||
          error.message.toLowerCase().includes('expired'))
      ) {
        logout();
      } else {
        console.warn('Keep user; non-auth error during refresh.');
      }
    }
  };
  

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
