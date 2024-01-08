import { useState } from 'react';
import { AssetModelPropertySummary } from '@aws-sdk/client-iotsitewise';
import { isEqual } from 'lodash';
import { useCustomCompareEffect } from 'react-use';

export const useSelectedAssetModelProperties = (
  initialAssetModelProperties: AssetModelPropertySummary[] = []
) => {
  const [selectedAssetModelProperties, setSelectedAssetModelProperties] =
    useState<AssetModelPropertySummary[]>(initialAssetModelProperties);

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
  properties?.map((id) => ({ id } as AssetModelPropertySummary)) ?? [];
