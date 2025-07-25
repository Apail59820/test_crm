import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useCreateContribution } from '@/hooks/useCreateContribution';
import { directus } from '@/lib/directus';
import { createItem } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  createItem: vi.fn((collection: string, data: unknown) => ({ collection, data }))
}));

const defaultPayload = {
  organizationName: 'ACME',
  sector: 'Tech',
  contactOrigin: 'Email',
  firstName: 'Jane',
  lastName: 'Doe',
  position: 'CTO',
  email: 'jane@acme.com',
  phone: '123',
  region: 'EU'
};

beforeEach(() => {
  vi.mocked(directus.request).mockReset();
});

describe('useCreateContribution', () => {
  it('creates organization when none provided', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce({ id: 'org1' });
    req.mockResolvedValueOnce({ id: 'contact1' });
    req.mockResolvedValueOnce({ id: 'contrib1' });

    const { result } = renderHook(() => useCreateContribution());

    await act(async () => {
      await result.current.mutateAsync(defaultPayload);
    });

    expect(req).toHaveBeenCalledTimes(3);
    expect(req.mock.calls[0][0]).toEqual({ collection: 'organizations', data: { name: 'ACME' } });
    expect(req.mock.calls[1][0]).toMatchObject({ collection: 'contacts' });
    expect(req.mock.calls[2][0]).toMatchObject({ collection: 'contributions' });
  });

  it('uses existing organization id', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce({ id: 'contact2' });
    req.mockResolvedValueOnce({ id: 'contrib2' });

    const { result } = renderHook(() => useCreateContribution());

    await act(async () => {
      await result.current.mutateAsync({ ...defaultPayload, organization: 'org2', organizationName: undefined });
    });

    expect(req).toHaveBeenCalledTimes(2);
    expect(req.mock.calls[0][0]).toMatchObject({ collection: 'contacts' });
    expect(req.mock.calls[1][0]).toMatchObject({ collection: 'contributions' });
  });
});
