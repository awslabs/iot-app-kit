import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { IotResourceExplorerSearchbar } from './searchbar';
import { DefaultDashboardMessages } from '../../../messages';

const mockSetCrumbsToSearch = jest.fn();
const mockSetPanelItems = jest.fn();

const mockAssetPropertiesCache = {
  property1: [{ id: '1', name: 'Property 1' }],
  property2: [{ id: '2', name: 'Property 2' }],
};

const mockProvider = {
  assetNodes: {
    asset1: { id: '1', asset: { name: 'Asset 1' } },
    asset2: { id: '2', asset: { name: 'Asset 2' } },
  },
} as any;

describe('IotResourceExplorerSearchbar', () => {
  it('should call setCrumbsToSearch and setPanelItems on change', () => {
    const { getByLabelText } = render(
      <IotResourceExplorerSearchbar
        provider={mockProvider}
        assetPropertiesCache={mockAssetPropertiesCache}
        setCrumbsToSearch={mockSetCrumbsToSearch}
        setPanelItems={mockSetPanelItems}
        messageOverrides={DefaultDashboardMessages}
      />
    );

    expect(mockSetPanelItems).not.toHaveBeenCalled();
    expect(mockSetCrumbsToSearch).not.toHaveBeenCalled();

    const autosuggest = getByLabelText(DefaultDashboardMessages.resourceExplorer.searchAriaLabel);
    act(() => {
      fireEvent.change(autosuggest, { target: { value: 'Asset 1' } });
    });

    expect(mockSetPanelItems).toHaveBeenCalled();
    expect(mockSetCrumbsToSearch).toHaveBeenCalled();
  });
});
