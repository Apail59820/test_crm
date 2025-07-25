import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { screen } from '@testing-library/react';
import ContributionCard from '@/components/ContributionCard/ContributionCard';
import { render } from './test-utils';

function renderCard(props: Record<string, unknown>) {
  return render(
    <ContributionCard
      title="ACME"
      sector="Tech"
      author="John"
      createdAt="2024-01-01"
      visibility="PUBLIC"
      {...props}
    />
  );
}

describe('ContributionCard', () => {
  beforeAll(() => {
    if (!window.matchMedia) {
      window.matchMedia = () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
      } as unknown as MediaQueryList);
    }
  });
  it('displays reminder badge when remind date is near', () => {
    const soon = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    const { container } = renderCard({ remindAt: soon });
    expect(container.querySelector('.ant-badge-status-error')).toBeInTheDocument();
  });

  it('shows contact role text', () => {
    renderCard({ contactName: 'Jane', contactRole: 'CEO' });
    expect(screen.getByText('Jane (CEO)')).toBeInTheDocument();
  });
});
