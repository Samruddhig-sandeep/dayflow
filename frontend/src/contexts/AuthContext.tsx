import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, currentUser, adminUser } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (employeeId: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email && password) {
      const mockUser = role === 'admin' ? adminUser : currentUser;
      setUser({ ...mockUser, role });
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (employeeId: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock signup - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (employeeId && email && password) {
      const mockUser = role === 'admin' ? adminUser : currentUser;
      setUser({ ...mockUser, employeeId, email, role });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      const mockUser = role === 'admin' ? adminUser : currentUser;
      setUser({ ...mockUser, role });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
