
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<'success' | 'unverified' | 'pending' | 'invalid'>;
  logout: () => void;
  updateCurrentUser: (updatedData: Partial<User>) => void;
}

const AUTH_STORAGE_KEY = 'cms-user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  
  const { users } = useData();

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<'success' | 'unverified' | 'pending' | 'invalid'> => {
    return new Promise(resolve => {
      setTimeout(() => { // Simulate API call
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
          if (foundUser.status === 'active') {
            const { password, ...userToStore } = foundUser;
            setUser(userToStore as User);
            resolve('success');
          } else if (foundUser.status === 'unverified') {
            resolve('unverified');
          } else if (foundUser.status === 'pending') {
            resolve('pending');
          } else {
            // This case should ideally not be hit with the current statuses
            resolve('invalid');
          }
        } else {
          resolve('invalid');
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateCurrentUser = (updatedData: Partial<User>) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const newUser = { ...prevUser, ...updatedData };
        // Also update localStorage to persist the change
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        return newUser;
    });
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};