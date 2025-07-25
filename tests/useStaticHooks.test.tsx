import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useContactQualifs } from '@/hooks/useContactQualifs';
import { useProjectQualifs } from '@/hooks/useProjectQualifs';
import { useContributionStatuses } from '@/hooks/useContributionStatuses';
import { useOrigins } from '@/hooks/useOrigins';
import { useSectors } from '@/hooks/useSectors';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readItems: vi.fn((collection: string, params: unknown) => ({ collection, params }))
}));

beforeEach(() => {
  vi.mocked(directus.request).mockClear();
});

describe('static lookup hooks', () => {
  it('fetches contact qualifs', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: '1', label: 'A' }]);
    const { result } = renderHook(() => useContactQualifs());
    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(readItems).toHaveBeenCalled();
    expect(result.current.data).toEqual([{ id: '1', label: 'A' }]);
  });

  it('fetches project qualifs', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: 'p1', label: 'B' }]);
    const { result } = renderHook(() => useProjectQualifs());
    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual([{ id: 'p1', label: 'B' }]);
  });

  it('fetches contribution statuses', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: 's1', label: 'OK' }]);
    const { result } = renderHook(() => useContributionStatuses());
    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual([{ id: 's1', label: 'OK' }]);
  });

  it('fetches origins', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: 'o1', label: 'Orig' }]);
    const { result } = renderHook(() => useOrigins());
    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual([{ id: 'o1', label: 'Orig' }]);
  });

  it('fetches sectors', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: 'sec1', label: 'Sec' }]);
    const { result } = renderHook(() => useSectors());
    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual([{ id: 'sec1', label: 'Sec' }]);
  });
});
