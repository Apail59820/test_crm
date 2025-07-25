import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }));
vi.mock('@/components/TopBar/TopBar', () => ({
  __esModule: true,
  default: () => <div data-testid="topbar">topbar</div>
}));

import { usePathname } from 'next/navigation';
import { render, screen, waitFor } from '@testing-library/react';
import AppProviders from '@/components/AppProviders/AppProviders';

const mockedUsePathname = vi.mocked(usePathname);

describe('AppProviders', () => {
  it('hides TopBar on login page', async () => {
    mockedUsePathname.mockReturnValue('/login');
    render(
      <AppProviders>
        <div>content</div>
      </AppProviders>
    );
    await waitFor(() => {
      expect(screen.queryByTestId('topbar')).toBeNull();
    });
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('shows TopBar on other pages', async () => {
    mockedUsePathname.mockReturnValue('/dashboard');
    render(
      <AppProviders>
        <div>child</div>
      </AppProviders>
    );
    await waitFor(() => {
      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    });
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
