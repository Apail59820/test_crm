import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { render } from './test-utils';
import * as routerModule from 'next/navigation';
import * as authModule from '@/lib/auth-context';
import { App } from 'antd';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ replace: vi.fn() }))
}));


// mock AntD App context
vi.mock('antd', async (importOriginal) => {
  const antd: never = await importOriginal();

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ...(antd),
    App: {
      useApp: vi.fn()
    }
  };
});

describe('LoginPage', () => {
  /** successful login triggers success message */
  it('logs in and shows welcome message', async () => {
    const login = vi.fn().mockResolvedValue({ first_name: 'Jane' });
    const replace = vi.fn();
    const success = vi.fn();

    const auth = vi.mocked(authModule.useAuth);
    const router = vi.mocked(routerModule.useRouter);
    const useApp = vi.mocked(App.useApp);
    auth.mockReturnValue({ login } as never);
    router.mockReturnValue({ replace } as never);
    useApp.mockReturnValue({ message: { success, error: vi.fn() } } as never);

    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText('Adresse email'), 'jane@doe.com');
    await userEvent.type(screen.getByPlaceholderText('Mot de passe'), 'pwd');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('jane@doe.com', 'pwd'));
    expect(success).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/');
  });

  /** failed login shows error */
  it('shows error on failed login', async () => {
    const login = vi.fn().mockRejectedValue(new Error('bad'));
    const error = vi.fn();

    const auth = vi.mocked(authModule.useAuth);
    const useApp = vi.mocked(App.useApp);
    auth.mockReturnValue({ login } as never);
    useApp.mockReturnValue({ message: { success: vi.fn(), error } } as never);

    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText('Adresse email'), 'bad@user');
    await userEvent.type(screen.getByPlaceholderText('Mot de passe'), 'pwd');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => expect(error).toHaveBeenCalled());
  });
});
