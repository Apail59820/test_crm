import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { StatCard } from '@/components/StatCard/StatCard';
import { render } from './test-utils';

describe('StatCard', () => {
  it('renders title, subtitle and content', () => {
    render(<StatCard title="T" subtitle="S" content={<span>Content</span>} />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('hides subtitle when not provided', () => {
    const { queryByText } = render(<StatCard title="A" content={<div>Hey</div>} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Hey')).toBeInTheDocument();
    expect(queryByText('S')).toBeNull();
  });
});
