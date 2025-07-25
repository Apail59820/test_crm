import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from './test-utils';
import Footer from '@/components/Footer/Footer';

describe('Footer', () => {
  it('renders links and text', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
    expect(container.textContent).toContain('Projex');
  });
});
