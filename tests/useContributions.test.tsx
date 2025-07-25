import { vi, describe, it, expect } from 'vitest';
import { renderHook } from './test-utils';
import { waitFor } from '@testing-library/react';
import { useContributions } from '@/hooks/useContributions';
import { directus } from '@/lib/directus';
import { useAuth } from '@/lib/auth-context';

/** Mock auth user returned by useAuth */
const mockUser = { id: '123', first_name: 'John', last_name: 'Doe', email: 'john@example.com' };

/** Dummy contribution from API */
const apiContribution = {
  id: '1',
  date_created: '2024-01-01',
  is_public: true,
  contact_function: 'PM',
  contact_qualification: { label: 'MAIN' },
  project_qualification: { label: 'OK' },
  contact: { first_name: 'Jane', last_name: 'Smith' },
  organization: { name: 'ACME' },
  sector_activity: { label: 'Tech' },
  user_created: { first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
  status: { label: 'PUBLISHED' }
};

/** Test suite for the custom hook */
describe('useContributions', () => {
  /** Ensure raw API data is converted to the expected domain format */
  it('maps API data to domain model', async () => {
    // mock API
    const mockedRequest = vi.mocked(directus.request as any);
    const mockedUseAuth = vi.mocked(useAuth);
    mockedRequest.mockResolvedValue([apiContribution]);
    mockedUseAuth.mockReturnValue({ user: mockUser, loading: false } as any);

    const { result } = renderHook(() => useContributions('all'));

    await waitFor(() => expect(mockedRequest).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data?.length).toBeGreaterThan(0));

    expect(result.current?.data?.[0]).toMatchObject({
      id: '1',
      title: 'ACME',
      sector: 'Tech',
      author: 'John Doe',
      visibility: 'PUBLIC'
    });
  });
});
