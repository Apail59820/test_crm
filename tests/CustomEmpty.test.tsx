import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import CustomEmpty from '@/components/CustomEmpty/CustomEmpty';
import { render } from './test-utils';

describe('CustomEmpty', () => {
  it('renders placeholder text', () => {
    render(<CustomEmpty />);
    expect(screen.getByText('Pas de résultat')).toBeInTheDocument();
  });
});
