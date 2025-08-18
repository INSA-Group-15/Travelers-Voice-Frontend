import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('transport_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    const mockUsers: Record<string, User> = {
      'police@transport.gov': {
        id: '1',
        name: 'Officer John Smith',
        email: 'police@transport.gov',
        role: 'traffic_police',
        location: 'Downtown District'
      },
      'manager@busstation.com': {
        id: '2',
        name: 'Sarah Johnson',
        email: 'manager@busstation.com',
        role: 'bus_station_manager',
        location: 'Central Bus Station'
      },
      'admin@transport.gov': {
        id: '3',
        name: 'Michael Chen',
        email: 'admin@transport.gov',
        role: 'transportation_office',
        location: 'Transportation Office'
      }
    };

    const user = mockUsers[email];
    if (user && password === 'password123') {
      setUser(user);
      localStorage.setItem('transport_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('transport_user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 