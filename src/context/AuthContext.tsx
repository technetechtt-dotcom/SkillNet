import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api, ApiUser, setToken } from '../lib/api';

interface AuthContextValue {
  user: ApiUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: {
    phone: string;
    password: string;
    name: string;
    location?: string;
    skills?: { name: string; icon?: string; level?: string }[];
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken(): string | null {
  return localStorage.getItem('skillnet_token');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const me = await api.users.me();
      setUser(me);
    } catch {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (phone: string, password: string) => {
    const { token, user: loggedInUser } = await api.auth.login(phone, password);
    setToken(token);
    setUser(loggedInUser);
  };

  const register = async (data: {
    phone: string;
    password: string;
    name: string;
    location?: string;
    skills?: { name: string; icon?: string; level?: string }[];
  }) => {
    const { token, user: newUser } = await api.auth.register(data);
    setToken(token);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
