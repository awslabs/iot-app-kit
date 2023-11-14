import React, { useEffect } from 'react';

import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import Box from '@cloudscape-design/components/box';

import { AssetModelExplorer } from './assetModelExplorer/assetModelExplorer';
import { AssetModelPropertiesExplorer } from './assetModelPropertiesExplorer/assetModelPropertiesExplorer';
import { createInitialAssetModelSummary, useSelectedAssetModel } from './useSelectedAssetModel';
import { HorizontalDivider } from '~/components/divider/horizontalDivider';
import { createInitialAssetModelProperties, useSelectedAssetModelProperties } from './useSelectedAssetModelProperties';
import { createInitialAsset, useSelectedAsset } from './useSelectedAsset';
import { createAssetModelQuery } from './createAssetModelQuery';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { getAssetModelQueryInformation } from './getAssetModelQueryInformation';
import { useModelBasedQuery } from './modelBasedQuery/useModelBasedQuery';
import { useModelBasedQuerySelection } from './modelBasedQuery/useModelBasedQuerySelection';

export interface AssetModelDataStreamExplorerProps {
  client: IoTSiteWiseClient;
}

export const AssetModelDataStreamExplorer = ({ client }: AssetModelDataStreamExplorerProps) => {
  const { assetModelId, assetIds, clearModelBasedWidgets, updateSelectedAsset } = useModelBasedQuery();
  const { assetModels, updateAssetModels, modelBasedWidgetsSelected } = useModelBasedQuerySelection();

  const { propertyIds } = getAssetModelQueryInformation(assetModels);

  const [selectedAssetModel, selectAssetModel] = useSelectedAssetModel(createInitialAssetModelSummary(assetModelId));
  const [selectedAsset, selectAsset] = useSelectedAsset(createInitialAsset(assetIds?.at(0)));
  const [selectedAssetModelProperties, selectAssetModelProperties] = useSelectedAssetModelProperties(
    createInitialAssetModelProperties(propertyIds)
  );

  /**
   * update every model based query widget
   * when the selected asset changes
   */
  useEffect(() => {
    updateSelectedAsset(selectedAsset);
  }, [updateSelectedAsset, selectedAsset]);

  const onReset = () => {
    selectAssetModel(undefined);
    selectAsset(undefined);
    selectAssetModelProperties([]);
    clearModelBasedWidgets();
  };

  const onSave = () => {
    if (selectedAssetModel?.id && selectedAssetModelProperties.length > 0) {
      updateAssetModels(
        createAssetModelQuery({
          assetModelId: selectedAssetModel.id,
          assetId: selectedAsset?.id,
          assetModelPropertyIds: createNonNullableList(selectedAssetModelProperties.map(({ id }) => id)),
        })
      );
    }
  };

  return (
    <Box padding={{ horizontal: 's' }}>
      <AssetModelExplorer
        onResetSelectedAssetModel={onReset}
        client={client}
        selectedAssetModel={selectedAssetModel}
        setSelectedAssetModel={selectAssetModel}
        selectedAsset={selectedAsset}
        setSelectedAsset={selectAsset}
      />
      {selectedAssetModel && (
        <>
          <Box padding={{ bottom: 's', top: 'm' }}>
            <HorizontalDivider />
          </Box>
          <AssetModelPropertiesExplorer
            selectedAssetModelProperties={selectedAssetModelProperties}
            selectedAssetModel={selectedAssetModel}
            client={client}
            onSave={onSave}
            saveDisabled={!modelBasedWidgetsSelected}
            onSelect={(assetModelProperties) => selectAssetModelProperties(assetModelProperties)}
          />
        </>
      )}
    </Box>
  );
};
