import {
  IoTSiteWise,
  IoTSiteWiseClient,
  PropertyDataType,
} from '@aws-sdk/client-iotsitewise';
import Tabs from '@cloudscape-design/components/tabs';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { QueryExtender } from './queryExtender';
import type { ModeledDataStream } from './modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import type { UnmodeledDataStream } from './unmodeledDataStreamExplorer/types';
import { useQuery } from '../useQuery';
import { AssetModelDataStreamExplorer } from './assetModelDataStreamExplorer/assetModelDataStreamExplorer';
import {
  AssetExplorer,
  type AssetExplorerProps,
  AssetPropertyExplorer,
  type AssetPropertyExplorerProps,
  TimeSeriesExplorer,
  type TimeSeriesExplorerProps,
} from '@iot-app-kit/react-components';
import { DEFAULT_TIME_SERIES_WITH_LATEST_VALUES_TABLE_DEFINITION } from '@iot-app-kit/react-components/dist/es/components/resource-explorers';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { ResourceExplorerFooter } from './footer/footer';
import { getPlugin } from '@iot-app-kit/core/dist/es/plugins/pluginsRegistry';
import Box from '@cloudscape-design/components/box';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import { isModeledPropertyInvalid } from '../helpers/isModeledPropertyInvalid';
import {
  AssetPropertyResource,
  AssetResource,
} from '@iot-app-kit/react-components/dist/es/components/resource-explorers/types/resources';

export interface IoTSiteWiseQueryEditorProps {
  onUpdateQuery: ReturnType<typeof useQuery>[1];
  iotSiteWise: IoTSiteWise;
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
}

export function IoTSiteWiseQueryEditor({
  onUpdateQuery,
  iotSiteWise,
}: IoTSiteWiseQueryEditorProps) {
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );

  const selectedWidgets = useSelectedWidgets();
  console.log(selectedWidgets);
  const correctSelectionMode =
    selectedWidgets.at(0)?.type === 'kpi' ? 'single' : 'multi';
  const metricsRecorder = getPlugin('metricsRecorder');

  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    NonNullable<AssetPropertyExplorerProps['selectedAssetProperties']>
  >([]);

  const [selectedTimeSeries, setSelectedTimeSeries] = useState<
    NonNullable<TimeSeriesExplorerProps['selectedTimeSeries']>
  >([]);

  const addButtonDisabled =
    selectedTimeSeries.length === 0 || selectedWidgets.length === 0;

  function handleClickAddModeledDataStreams(
    newModeledDataStreams: ModeledDataStream[]
  ) {
    onUpdateQuery((currentQuery) => {
      const queryExtender = new QueryExtender(currentQuery);
      const updatedQuery = queryExtender.extendAssetQueries(
        newModeledDataStreams
      );

      return updatedQuery;
    });
  }

  function handleClickAddUnmodeledDataStreams(
    newUnmodeledDataStreams: UnmodeledDataStream[]
  ) {
    onUpdateQuery((currentQuery) => {
      const queryExtender = new QueryExtender(currentQuery);
      const updatedQuery = queryExtender.extendPropertyAliasQueries(
        newUnmodeledDataStreams
      );

      return updatedQuery;
    });
  }

  function propertySelectionLabel(
    selectedItems: AssetPropertyExplorerProps['selectedAssetProperties'],
    modeledDataStream: AssetPropertyResource
  ) {
    const isPropertySelected = selectedItems?.find(
      (item) => item.propertyId === modeledDataStream.propertyId
    );

    if (
      isModeledPropertyInvalid(
        modeledDataStream.dataType as PropertyDataType,
        selectedWidgets?.at(0)?.type
      )
    ) {
      return `${modeledDataStream.dataType} data not supported for the selected widget`;
    } else if (!isPropertySelected) {
      return `Select modeled data stream ${modeledDataStream.name}`;
    } else {
      return `Deselect modeled data stream ${modeledDataStream.name}`;
    }
  }

  const modeledTab = {
    label: 'Modeled',
    id: 'explore-modeled-tab',
    content: (
      <Box padding={{ horizontal: 's' }}>
        <AssetExplorer
          requestFns={iotSiteWise}
          onSelectAsset={setSelectedAssets}
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
              isModeledPropertyInvalid(
                item.dataType as PropertyDataType,
                selectedWidgets.at(0)?.type
              )
            }
            ariaLabels={{
              resizerRoleDescription: 'Resize button',
              itemSelectionLabel: ({ selectedItems }, modeledDataStream) =>
                propertySelectionLabel([...selectedItems], modeledDataStream),
            }}
          />
        )}
        <ResourceExplorerFooter
          addDisabled={addButtonDisabled}
          onReset={() => setSelectedAssetProperties([])}
          onAdd={() => {
            handleClickAddModeledDataStreams(
              selectedAssetProperties as ModeledDataStream[]
            );
            setSelectedAssetProperties([]); //clear table after adding it to widget
            metricsRecorder?.record({
              metricName: 'ModeledDataStreamAdd',
              metricValue: 1,
            });
          }}
        />
      </Box>
    ),
  };

  const unmodeledTab = {
    label: 'Unmodeled',
    id: 'explore-unmodeled-tab',
    content: (
      <Box padding={{ horizontal: 's' }}>
        <TimeSeriesExplorer
          selectionMode={correctSelectionMode}
          requestFns={iotSiteWise}
          onSelectTimeSeries={setSelectedTimeSeries}
          selectedTimeSeries={selectedTimeSeries}
          parameters={[{ timeSeriesType: 'DISASSOCIATED' }]}
          tableSettings={{
            isFilterEnabled: true,
            isUserSettingsEnabled: true,
          }}
          tableResourceDefinition={
            DEFAULT_TIME_SERIES_WITH_LATEST_VALUES_TABLE_DEFINITION
          }
        />
        <ResourceExplorerFooter
          addDisabled={addButtonDisabled}
          onReset={() => setSelectedAssetProperties([])}
          onAdd={() => {
            handleClickAddUnmodeledDataStreams(
              selectedTimeSeries as unknown as UnmodeledDataStream[]
            );
            setSelectedAssetProperties([]); //clear table after adding it to widget
            metricsRecorder?.record({
              metricName: 'UnmodeledDataStreamAdd',
              metricValue: 1,
            });
          }}
        />
      </Box>
    ),
    disabled: isEdgeModeEnabled,
  };

  const assetModeledTab = {
    label: 'Dynamic assets',
    id: 'explore-asset-model-tab',
    content: <AssetModelDataStreamExplorer client={iotSiteWise} />,
  };

  const defaultTabs = [modeledTab, unmodeledTab, assetModeledTab];

  return <Tabs tabs={defaultTabs} />;
}
