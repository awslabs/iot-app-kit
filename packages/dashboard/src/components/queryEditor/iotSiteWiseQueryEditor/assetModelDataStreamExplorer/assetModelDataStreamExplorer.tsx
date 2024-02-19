import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  type AssetModelPropertySummary,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

import Box from '@cloudscape-design/components/box';

import { AssetModelExplorer } from './assetModelExplorer/assetModelExplorer';
import { AssetModelPropertiesExplorer } from './assetModelPropertiesExplorer/assetModelPropertiesExplorer';
import { AssetModelPropertiesExplorerEdge } from './assetModelPropertiesExplorer/assetModelPropertiesExplorerEdge';
import {
  createInitialAssetModelSummary,
  useSelectedAssetModel,
} from './useSelectedAssetModel';
import { HorizontalDivider } from '~/components/divider/horizontalDivider';
import {
  createInitialAssetModelProperties,
  useSelectedAssetModelProperties,
} from './useSelectedAssetModelProperties';
import { createInitialAsset, useSelectedAsset } from './useSelectedAsset';
import { createAssetModelQuery } from './createAssetModelQuery';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { getAssetModelQueryInformation } from './getAssetModelQueryInformation';
import { useModelBasedQuery } from './modelBasedQuery/useModelBasedQuery';
import { useModelBasedQuerySelection } from './modelBasedQuery/useModelBasedQuerySelection';
import { getPlugin } from '@iot-app-kit/core';
import type { DashboardState } from '~/store/state';

export interface AssetModelDataStreamExplorerProps {
  client: IoTSiteWiseClient;
}

export const AssetModelDataStreamExplorer = ({
  client,
}: AssetModelDataStreamExplorerProps) => {
  const metricsRecorder = getPlugin('metricsRecorder');
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );
  const {
    assetModelId,
    assetIds,
    clearModelBasedWidgets,
    updateSelectedAsset,
  } = useModelBasedQuery();
  const { assetModels, updateAssetModels, modelBasedWidgetsSelected } =
    useModelBasedQuerySelection();

  const { propertyIds } = getAssetModelQueryInformation(assetModels);

  const [selectedAssetModel, selectAssetModel] = useSelectedAssetModel(
    createInitialAssetModelSummary(assetModelId)
  );
  const [selectedAsset, selectAsset] = useSelectedAsset(
    createInitialAsset(assetIds?.at(0))
  );
  const [selectedAssetModelProperties, selectAssetModelProperties] =
    useSelectedAssetModelProperties(
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
          assetModelPropertyIds: createNonNullableList(
            selectedAssetModelProperties.map(({ id }) => id)
          ),
        })
      );
      metricsRecorder?.record({
        metricName: 'AssetModelDataStreamAdd',
        metricValue: 1,
      });
    }
  };

  const assetModelPropertiesExplorerProps = {
    selectedAssetModelProperties,
    selectedAssetModel,
    client,
    onSave,
    saveDisabled: !modelBasedWidgetsSelected,
    onSelect: (assetModelProperties: AssetModelPropertySummary[]) =>
      selectAssetModelProperties(assetModelProperties),
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
          {isEdgeModeEnabled ? (
            <AssetModelPropertiesExplorerEdge
              {...assetModelPropertiesExplorerProps}
            />
          ) : (
            <AssetModelPropertiesExplorer
              {...assetModelPropertiesExplorerProps}
            />
          )}
        </>
      )}
    </Box>
  );
};
