import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import LandingPage from '@/app/(protected)/page';
import { render } from './test-utils';

vi.mock('@/components/TopFold/TopFold', () => ({
  __esModule: true,
  default: () => <div data-testid="topfold">topfold</div>,
}));
vi.mock('@/components/HowItWorks/HowItWorks', () => ({
  __esModule: true,
  default: () => <div data-testid="how">how it works</div>,
}));
vi.mock('@/components/SupportSection/SupportSection', () => ({
  __esModule: true,
  default: () => <div data-testid="support">support</div>,
}));

describe('LandingPage', () => {
  it('renders all sections', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('topfold')).toBeInTheDocument();
    expect(screen.getByTestId('how')).toBeInTheDocument();
    expect(screen.getByTestId('support')).toBeInTheDocument();
  });
});
