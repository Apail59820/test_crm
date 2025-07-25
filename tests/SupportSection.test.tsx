import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render } from './test-utils';
import SupportSection from '@/components/SupportSection/SupportSection';

// Mock next/image and IntersectionObserver
vi.mock('next/image', () => ({ __esModule: true, default: () => <img /> }));

beforeAll(() => {
  class IO {
    observe() {}
    disconnect() {}
  }
  // @ts-ignore
  global.IntersectionObserver = IO;
});


describe('SupportSection', () => {
  it('renders support button', () => {
    const { getByRole } = render(<SupportSection />);
    expect(getByRole('link')).toHaveTextContent('Contacter le support');
  });
});
