import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserSession {
  username: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (newToken: string, username: string, role: string) => {
    localStorage.setItem('token', newToken);
    const sessionUser = { username, role };
    localStorage.setItem('user', JSON.stringify(sessionUser));
    setToken(newToken);
    setUser(sessionUser);
  };

  // Check active token validity with the backend on startup
  useEffect(() => {
    const verifySession = async () => {
      const activeToken = localStorage.getItem('token');
      if (!activeToken) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/session`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (response.ok) {
          const sessionData = await response.json();
          setUser({ username: sessionData.username, role: sessionData.role });
        } else {
          logout();
        }
      } catch (e) {
        // network failure, keep local state for now but don't force logout
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (_) {}
        }
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, logout }}>
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
