import React, { ReactElement } from 'react';
import { render as rtlRender, renderHook as rtlRenderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext, Me } from '@/lib/auth-context';

export function render(ui: ReactElement, { user }: { user?: Me | null } = {}) {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{
        user: user ?? null,
        loading: false,
        login: async () => { throw new Error('login mock not implemented'); },
        logout: async () => {}
      }}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
  return rtlRender(ui, { wrapper: Wrapper });
}

export function renderHook<T>(hook: () => T, { user }: { user?: Me | null } = {}) {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{
        user: user ?? null,
        loading: false,
        login: async () => { throw new Error('login mock not implemented'); },
        logout: async () => {}
      }}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
  return rtlRenderHook(hook, { wrapper: Wrapper });
}
