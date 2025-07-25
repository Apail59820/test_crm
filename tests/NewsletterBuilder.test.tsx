import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from './test-utils';
import NewsletterBuilder from '@/components/NewsletterBuilder/NewsletterBuilder';
import { useNewsletterContributions } from '@/hooks/useNewsletterContributions';

vi.mock('@/hooks/useNewsletterContributions');

const mockContribution = {
  id: '1',
  organization: 'Org',
  contributor: 'John',
  region: 'EU',
  date: '2024-01-01',
  summary: 'Summary',
  visibility: 'PUBLIC' as const,
  status: 'OPEN',
};

describe('NewsletterBuilder', () => {
  it('renders contribution preview', () => {
    vi.mocked(useNewsletterContributions).mockReturnValue({
      data: [mockContribution],
      isLoading: false,
    } as any);

    const { getByText } = render(<NewsletterBuilder />);

    expect(getByText('Org')).toBeInTheDocument();
    expect(getByText('John — EU')).toBeInTheDocument();
    expect(getByText('Summary')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    vi.mocked(useNewsletterContributions).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    const { getByText } = render(<NewsletterBuilder />);
    expect(getByText('Aucune contribution')).toBeInTheDocument();
  });
});
