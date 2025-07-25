import React from 'react';
import { vi, describe, it, expect, type Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import OrganizationSelector from '@/components/OrganizationSelector/OrganizationSelector';
import { useOrganizations } from '@/hooks/useOrganizations';
import { render } from './test-utils';

vi.mock('@/hooks/useOrganizations');

describe('OrganizationSelector', () => {
  /** selecting an existing organization emits the correct value */
  it('allows selecting an option', async () => {
    const onChange = vi.fn();
    (useOrganizations as unknown as Mock).mockReturnValue({
      data: [
        { id: '1', name: 'Org1' },
        { id: '2', name: 'Org2' },
      ],
      isLoading: false,
    });

    render(<OrganizationSelector onChange={onChange} />);
    const combo = screen.getByRole('combobox');
    await userEvent.type(combo, 'Org');

    await waitFor(() => {
      expect(screen.getByText('Org1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Org1'));
    expect(onChange).toHaveBeenCalledWith({ id: '1', name: 'Org1' });
  });

  /** creating a new organization when none matches */
  it('offers creation when search has no result', async () => {
    const onChange = vi.fn();
    (useOrganizations as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<OrganizationSelector onChange={onChange} />);
    const combo = screen.getByRole('combobox');
    await userEvent.type(combo, 'New Org');

    await waitFor(() => {
      expect(screen.getByText(/Créer "New Org"/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText(/Créer "New Org"/));
    expect(onChange).toHaveBeenCalledWith({ name: 'New Org' });
  });
});
