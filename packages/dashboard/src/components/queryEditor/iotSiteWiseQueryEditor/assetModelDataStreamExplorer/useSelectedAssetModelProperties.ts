import { useState } from 'react';
import { isEqual } from 'lodash';
import { useCustomCompareEffect } from 'react-use';
import {
  type AssetPropertyExplorerProps,
  type AssetPropertyResource,
} from '@iot-app-kit/react-components';

export const useSelectedAssetModelProperties = (
  initialAssetModelProperties: NonNullable<
    AssetPropertyExplorerProps['selectedAssetProperties']
  > = []
) => {
  const [selectedAssetModelProperties, setSelectedAssetModelProperties] =
    useState<
      NonNullable<AssetPropertyExplorerProps['selectedAssetProperties']>
    >([]);

  useCustomCompareEffect(
    () => {
      setSelectedAssetModelProperties(initialAssetModelProperties);
    },
    [initialAssetModelProperties],
    isEqual
  );

  return [
    selectedAssetModelProperties,
    setSelectedAssetModelProperties,
  ] as const;
};

export type SelectedAssetModelProperties = ReturnType<
  typeof useSelectedAssetModelProperties
>[0];
export type UpdateSelectedAssetModelProperties = ReturnType<
  typeof useSelectedAssetModelProperties
>[1];

export const createInitialAssetModelProperties = (properties?: string[]) =>
  properties?.map((propertyId) => ({ propertyId } as AssetPropertyResource)) ??
  [];
