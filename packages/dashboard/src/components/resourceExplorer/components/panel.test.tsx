import * as React from 'react';
import { render } from '@testing-library/react';
import { wrapWithTestBackend } from 'react-dnd-test-utils';
import { ResourceExplorerPanel } from './panel';
import { DashboardMessages } from '~/messages';

const mockMessageOverrides = { resourceExplorer: { panelEmptyLabel: 'Empty panel' } } as DashboardMessages;

const [PanelContext] = wrapWithTestBackend(ResourceExplorerPanel);

describe('ResourceExplorerPanel', () => {
  it('renders empty panel message when no items passed', () => {
    const { getByText } = render(<PanelContext assetId='Asset1' messageOverrides={mockMessageOverrides} />);

    expect(getByText('Empty panel')).toBeTruthy();
  });
});
