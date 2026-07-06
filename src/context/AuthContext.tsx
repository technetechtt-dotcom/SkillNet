import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { User } from "../types";
import { setAuthHandlers } from "../lib/http";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isInitializing: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  register: (payload: { name: string; phone: string; location: string }) => Promise<void>;
  refreshSession: () => Promise<string | null>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "skillnet.auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setIsInitializing(false);
      return;
    }
    const parsed = JSON.parse(raw) as {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
      user: User;
    };
    setAccessToken(parsed.accessToken);
    setRefreshToken(parsed.refreshToken);
    setExpiresAt(parsed.expiresAt);
    setUser(parsed.user);
    setIsInitializing(false);
  }, []);

  const persist = useCallback(
    (
      nextAccessToken: string,
      nextRefreshToken: string,
      nextExpiresInSeconds: number,
      nextUser: User
    ) => {
      const nextExpiresAt = Date.now() + nextExpiresInSeconds * 1000;
      setAccessToken(nextAccessToken);
      setRefreshToken(nextRefreshToken);
      setExpiresAt(nextExpiresAt);
      setUser(nextUser);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken: nextAccessToken,
          refreshToken: nextRefreshToken,
          expiresAt: nextExpiresAt,
          user: nextUser
        })
      );
    },
    []
  );

  const refreshSession = useCallback(async () => {
    if (!refreshToken) return null;
    const data = await api.refreshSession(refreshToken);
    persist(data.accessToken, data.refreshToken, data.expiresIn, data.user);
    return data.accessToken;
  }, [persist, refreshToken]);

  const signIn = useCallback(
    async (phone: string, password: string) => {
      const data = await api.signIn(phone, password);
      persist(data.accessToken, data.refreshToken, data.expiresIn, data.user);
    },
    [persist]
  );

  const register = useCallback(
    async (payload: { name: string; phone: string; location: string }) => {
      const data = await api.register(payload);
      persist(data.accessToken, data.refreshToken, data.expiresIn, data.user);
    },
    [persist]
  );

  const signOut = useCallback(() => {
    if (refreshToken) {
      api.logout(refreshToken).catch(() => undefined);
    }
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [refreshToken]);

  useEffect(() => {
    setAuthHandlers({
      getAccessToken: () => accessToken,
      refreshAccessToken: refreshSession,
      onAuthFailure: signOut
    });
  }, [accessToken, refreshSession, signOut]);

  useEffect(() => {
    if (!accessToken || !expiresAt) return;
    if (Date.now() > expiresAt - 20_000) {
      refreshSession().catch(() => signOut());
      return;
    }
    const timeout = window.setTimeout(() => {
      refreshSession().catch(() => signOut());
    }, Math.max(5000, expiresAt - Date.now() - 20_000));
    return () => clearTimeout(timeout);
  }, [accessToken, expiresAt, refreshSession, signOut]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isInitializing,
      signIn,
      register,
      refreshSession,
      signOut
    }),
    [
      user,
      accessToken,
      refreshToken,
      isInitializing,
      signIn,
      register,
      refreshSession,
      signOut
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
