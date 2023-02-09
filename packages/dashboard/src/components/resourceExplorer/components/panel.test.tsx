import * as React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { wrapWithTestBackend } from 'react-dnd-test-utils';
import { ResourceExplorerPanel } from './panel';
import { DashboardMessages } from '../../../messages';
import { ExtendedPanelAssetSummary } from '..';

const mockMessageOverrides = { resourceExplorer: { panelEmptyLabel: 'Empty panel' } } as DashboardMessages;

const mockPanelItems = [
  { id: 'Asset1', name: 'Asset 1', isAsset: true, isAssetProperty: false },
  { id: 'Asset2', name: 'Asset 2', isAsset: true, isAssetProperty: false },
  { id: 'AssetProperty1', name: 'Asset Property 1', isAsset: false, isAssetProperty: true },
];

const mockAlarms = [
  { id: 'Alarm1', name: 'Alarm 1', assetCompositeModels: [{ type: 'AWS/ALARM' }] } as ExtendedPanelAssetSummary,
];

const mockHandlePanelItemClick = jest.fn();

const [PanelContext] = wrapWithTestBackend(ResourceExplorerPanel);

describe('ResourceExplorerPanel', () => {
  it('renders empty panel message when no items passed', () => {
    const { getByText } = render(
      <PanelContext
        alarms={[]}
        panelItems={[]}
        handlePanelItemClick={mockHandlePanelItemClick}
        messageOverrides={mockMessageOverrides}
      />
    );

    expect(getByText('Empty panel')).toBeTruthy();
  });

  it('renders panel items and calls handlePanelItemClick when an asset panel item is clicked', () => {
    const { getByText } = render(
      <PanelContext
        alarms={mockAlarms}
        panelItems={mockPanelItems}
        handlePanelItemClick={mockHandlePanelItemClick}
        messageOverrides={mockMessageOverrides}
      />
    );

    expect(getByText('Asset 1')).toBeTruthy();
    expect(getByText('Asset 2')).toBeTruthy();
    expect(getByText('Asset Property 1')).toBeTruthy();
    expect(getByText('Alarm 1')).toBeTruthy();

    act(() => {
      fireEvent.click(getByText('Asset 1'));
    });

    expect(mockHandlePanelItemClick).toHaveBeenCalledWith(mockPanelItems[0]);
  });
});
