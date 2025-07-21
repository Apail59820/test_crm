"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from "react";
import { directus } from "./directus";
import { readMe, type DirectusUser } from "@directus/sdk";
import type { ApiCollections } from "../../models/types";

export type Me = DirectusUser<ApiCollections>;

interface AuthValue {
  user: Me | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Me>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | undefined>(undefined);

// ✅ 2) Provider
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await directus.request<Me>(readMe());
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<Me> => {
    await directus.login(email, password);
    const me = await directus.request<Me>(readMe());

    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    await directus.logout();
    setUser(null);
  }, []);

  const value: AuthValue = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be wrapped in <AuthProvider>");
  return ctx;
}
