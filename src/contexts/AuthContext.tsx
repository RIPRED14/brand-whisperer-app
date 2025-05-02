
import React, { createContext, useState, useContext, useEffect } from 'react';

export type UserRole = 'coordinator' | 'technician' | 'guest';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('qc_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    // In a real app, this would validate against a backend
    // For now, simulate authentication with localStorage
    const mockUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role
    };

    setUser(mockUser);
    localStorage.setItem('qc_user', JSON.stringify(mockUser));
    
    // Add to access log
    const accessLog = JSON.parse(localStorage.getItem('qc_access_log') || '[]');
    accessLog.push({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      timestamp: new Date().toISOString(),
      action: 'login'
    });
    localStorage.setItem('qc_access_log', JSON.stringify(accessLog));
  };

  const logout = () => {
    if (user) {
      // Add to access log
      const accessLog = JSON.parse(localStorage.getItem('qc_access_log') || '[]');
      accessLog.push({
        userId: user.id,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString(),
        action: 'logout'
      });
      localStorage.setItem('qc_access_log', JSON.stringify(accessLog));
    }

    setUser(null);
    localStorage.removeItem('qc_user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
