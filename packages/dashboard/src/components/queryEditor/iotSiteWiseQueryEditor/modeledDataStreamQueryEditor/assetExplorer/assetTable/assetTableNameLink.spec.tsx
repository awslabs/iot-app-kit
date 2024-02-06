import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AssetTableNameLink } from './assetTableNameLink';

test('renders Link component with correct ariaLabel and onFollow event', () => {
  const assetId = '123';
  const assetName = 'Demo Asset Wind Farm';
  const updateParentAssetId = jest.fn();

  const { getByText, getByTestId } = render(
    <AssetTableNameLink
      assetId={assetId}
      assetName={assetName}
      updateParentAssetId={updateParentAssetId}
    />
  );
  const link = getByText(assetName);

  expect(link).toBeInTheDocument();

  const linkText = getByTestId('asset-name-link');
  expect(linkText).toHaveAttribute(
    'title',
    `View children assets of ${assetName}`
  );

  fireEvent.click(link);
  expect(updateParentAssetId).toHaveBeenCalledWith(assetId);
});
