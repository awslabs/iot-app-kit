import React, { useEffect } from 'react';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';

import Box from '@cloudscape-design/components/box';

import { AssetModelExplorer } from './assetModelExplorer/assetModelExplorer';
import { AssetModelPropertiesExplorer } from './assetModelPropertiesExplorer/assetModelPropertiesExplorer';
import {
  createInitialAssetModelResource,
  useSelectedAssetModel,
} from './useSelectedAssetModel';
import { HorizontalDivider } from '~/components/divider/horizontalDivider';
import {
  createInitialAssetModelProperties,
  useSelectedAssetModelProperties,
} from './useSelectedAssetModelProperties';
import {
  createInitialAssetResource,
  useSelectedAsset,
} from './useSelectedAsset';
import { useModelBasedQuery } from './modelBasedQuery/useModelBasedQuery';
import { getAssetModelQueryInformation } from './getAssetModelQueryInformation';
import { useModelBasedQuerySelection } from './modelBasedQuery/useModelBasedQuerySelection';
import { createAssetModelQuery } from './createAssetModelQuery';
import { getPlugin } from '@iot-app-kit/core';
import { ResourceExplorerFooter } from '../footer/footer';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { DashboardWidget } from '~/types';
import { AssetResource } from '@iot-app-kit/react-components';
import { useAssetsForAssetModel } from './assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';

export interface AssetModelDataStreamExplorerProps {
  iotSiteWiseClient: IoTSiteWise;
  selectedWidgets: DashboardWidget[];
  addButtonDisabled: boolean;
  correctSelectionMode: 'single' | 'multi';
  timeZone?: string;
  significantDigits?: number;
}

export const AssetModelDataStreamExplorer = ({
  iotSiteWiseClient,
  selectedWidgets,
  addButtonDisabled,
  correctSelectionMode,
  timeZone,
  significantDigits,
}: AssetModelDataStreamExplorerProps) => {
  const metricsRecorder = getPlugin('metricsRecorder');
  const {
    assetModelId,
    assetIds,
    clearModelBasedWidgets,
    updateSelectedAsset,
  } = useModelBasedQuery();

  const { assetSummaries } = useAssetsForAssetModel({
    assetModelId,
    iotSiteWiseClient,
    fetchAll: true,
  });

  const currentSelectedAsset = assetSummaries.find(
    ({ id }) => id === assetIds?.at(0)
  );

  const { assetModels, updateAssetModels } = useModelBasedQuerySelection();

  const { propertyIds } = getAssetModelQueryInformation(assetModels);

  const [selectedAssetModel, selectAssetModel] = useSelectedAssetModel(
    createInitialAssetModelResource(assetModelId)
  );

  const [selectedAsset, selectAsset] = useSelectedAsset(
    currentSelectedAsset
      ? [
          {
            ...currentSelectedAsset,
            assetId: currentSelectedAsset?.id,
          } as AssetResource,
        ]
      : createInitialAssetResource(assetIds?.at(0))
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
    updateSelectedAsset(selectedAsset[0]);
  }, [updateSelectedAsset, selectedAsset]);

  useEffect(() => {
    if (currentSelectedAsset)
      selectAsset([
        {
          ...currentSelectedAsset,
          assetId: currentSelectedAsset?.id,
        } as AssetResource,
      ]);
  }, [currentSelectedAsset, selectAsset]);

  const onReset = () => {
    selectAssetModel([]);
    selectAsset([]);
    selectAssetModelProperties([]);
    clearModelBasedWidgets();
  };

  const onSave = () => {
    if (
      selectedAssetModel[0].assetModelId &&
      selectedAssetModelProperties.length > 0
    ) {
      updateAssetModels(
        createAssetModelQuery({
          assetModelId: selectedAssetModel[0].assetModelId,
          assetId: selectedAsset?.at(0)?.assetId,
          assetModelPropertyIds: createNonNullableList(
            selectedAssetModelProperties.map(({ propertyId }) => propertyId)
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
    iotSiteWiseClient,
    selectedAsset,
    selectAssetModelProperties,
    selectedAssetModelProperties,
    correctSelectionMode,
    selectedWidgets,
    timeZone,
    significantDigits,
  };

  return (
    <Box padding={{ horizontal: 's' }}>
      <AssetModelExplorer
        onResetSelectedAssetModel={onReset}
        iotSiteWiseClient={iotSiteWiseClient}
        selectedAssetModel={selectedAssetModel}
        setSelectedAssetModel={selectAssetModel}
        selectedAsset={selectedAsset}
        setSelectedAsset={selectAsset}
      />
      {selectedAssetModel.length > 0 && (
        <>
          <Box padding={{ bottom: 's', top: 'm' }}>
            <HorizontalDivider />
          </Box>

          <AssetModelPropertiesExplorer
            {...assetModelPropertiesExplorerProps}
          />

          <ResourceExplorerFooter
            addDisabled={addButtonDisabled}
            onReset={() => selectAssetModelProperties([])}
            onAdd={() => {
              onSave();
              selectAssetModelProperties([]); //clear table after adding it to widget
            }}
          />
        </>
      )}
    </Box>
  );
};
