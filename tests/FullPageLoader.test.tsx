import React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render } from './test-utils';
import FullPageLoader from '@/components/FullPageLoader/FullPageLoader';

vi.mock('framer-motion', () => ({
  motion: { div: (p: any) => <div {...p} /> },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('FullPageLoader', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia ||
      ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })) as any;
  });
  it('shows loading text', () => {
    const { container } = render(<FullPageLoader />);
    expect(container.textContent).toContain('Chargement');
  });
});
