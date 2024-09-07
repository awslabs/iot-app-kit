import { Box } from '@cloudscape-design/components';
import {
  AssetExplorer,
  AssetExplorerProps,
  AssetPropertyExplorer,
  AssetPropertyExplorerProps,
  AssetPropertyResource,
  AssetResource,
  SelectionMode,
} from '@iot-app-kit/react-components';
import React, { useState } from 'react';
import { isModeledPropertyInvalid } from '../../helpers/isModeledPropertyInvalid';
import { ResourceExplorerFooter } from '../footer/footer';
import { QueryExtender } from '../queryExtender';
import { getPlugin } from '@iot-app-kit/core';
import { useQuery } from '../../useQuery';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { DashboardWidget } from '~/types';
import { propertySelectionLabel } from '../../helpers/propertySelectionLabel';

type ModeledExplorerProps = {
  onUpdateQuery: ReturnType<typeof useQuery>[1];
  iotSiteWise: IoTSiteWise;
  correctSelectionMode: SelectionMode;
  addButtonDisabled: boolean;
  selectedWidgets: DashboardWidget[];
};

export const ModeledExplorer = ({
  onUpdateQuery,
  iotSiteWise,
  correctSelectionMode,
  addButtonDisabled,
  selectedWidgets,
}: ModeledExplorerProps) => {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    NonNullable<AssetPropertyExplorerProps['selectedAssetProperties']>
  >([]);

  const metricsRecorder = getPlugin('metricsRecorder');

  function handleSelectAssets(
    assets: NonNullable<AssetExplorerProps['selectedAssets']>
  ) {
    setSelectedAssets(assets);
    setSelectedAssetProperties([]);
  }

  function handleClickAddModeledDataStreams(
    newModeledDataStreams: readonly AssetPropertyResource[]
  ) {
    onUpdateQuery((currentQuery) => {
      const queryExtender = new QueryExtender(currentQuery);
      const updatedQuery = queryExtender.extendAssetQueries(
        newModeledDataStreams
      );

      return updatedQuery;
    });
  }

  return (
    <Box padding={{ horizontal: 's' }}>
      <AssetExplorer
        requestFns={iotSiteWise}
        onSelectAsset={handleSelectAssets}
        selectedAssets={selectedAssets}
        selectionMode='single'
        tableSettings={{
          isSearchEnabled: true,
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
        description='Browse through your asset hierarchy and select an asset to view its associated data streams.'
        ariaLabels={{
          resizerRoleDescription: 'Resize button',
          itemSelectionLabel: (isNotSelected, asset: AssetResource) =>
            isNotSelected
              ? `Select asset ${asset.name}`
              : `Deselect asset ${asset.name}`,
        }}
      />
      {selectedAssets.length > 0 && (
        <AssetPropertyExplorer
          requestFns={iotSiteWise}
          parameters={selectedAssets}
          selectionMode={correctSelectionMode}
          onSelectAssetProperty={setSelectedAssetProperties}
          selectedAssetProperties={selectedAssetProperties}
          tableSettings={{
            isFilterEnabled: true,
            isUserSettingsEnabled: true,
          }}
          isAssetPropertyDisabled={(item) =>
            isModeledPropertyInvalid(item.dataType, selectedWidgets.at(0)?.type)
          }
          ariaLabels={{
            resizerRoleDescription: 'Resize button',
            itemSelectionLabel: ({ selectedItems }, modeledDataStream) =>
              propertySelectionLabel(
                [...selectedItems],
                modeledDataStream,
                selectedWidgets
              ),
          }}
          description='Select a modeled datastream to add to a selected widget'
        />
      )}
      <ResourceExplorerFooter
        addDisabled={addButtonDisabled}
        onReset={() => setSelectedAssetProperties([])}
        onAdd={() => {
          handleClickAddModeledDataStreams(selectedAssetProperties);
          setSelectedAssetProperties([]); //clear table after adding it to widget
          metricsRecorder?.record({
            metricName: 'ModeledDataStreamAdd',
            metricValue: 1,
          });
        }}
      />
    </Box>
  );
};
