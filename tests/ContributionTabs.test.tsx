import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import ContributionTabs from '@/components/ContributionTabs/ContributionTabs';
import { render } from './test-utils';

describe('ContributionTabs', () => {
  it('calls callbacks on actions', async () => {
    const onChange = vi.fn();
    const onCreate = vi.fn();
    render(<ContributionTabs activeTab="all" onChangeTab={onChange} onCreate={onCreate} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Publiques' }));
    expect(onChange).toHaveBeenCalledWith('public');

    await userEvent.click(screen.getByRole('button', { name: /Nouvelle contribution/i }));
    expect(onCreate).toHaveBeenCalled();
  });
});
