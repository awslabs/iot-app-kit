import { Box, ExpandableSection } from '@cloudscape-design/components';
import {
  AlarmExplorer,
  type AlarmExplorerProps,
  type AlarmResource,
  AssetExplorer,
  type AssetExplorerProps,
  AssetPropertyExplorer,
  type AssetPropertyExplorerProps,
  type AssetPropertyResource,
  type AssetResource,
  type SelectionMode,
} from '@iot-app-kit/react-components';
import { useState } from 'react';
import { isModeledPropertyInvalid } from '../../helpers/isModeledPropertyInvalid';
import { ResourceExplorerFooter } from '../footer/footer';
import { QueryExtender } from '../queryExtender';
import { getPlugin } from '@iot-app-kit/core';
import { type useQuery } from '../../useQuery';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { type DashboardWidget } from '~/types';
import { propertySelectionLabel } from '../../helpers/propertySelectionLabel';
import { alarmSelectionLabel } from '../../helpers/alarmSelectionLabel';
import { ExpandableSectionHeading } from '../components/expandableSectionHeading';

type ModeledExplorerProps = {
  onUpdateQuery: ReturnType<typeof useQuery>[1];
  iotSiteWiseClient: IoTSiteWise;
  correctSelectionMode: SelectionMode;
  addButtonDisabled: boolean;
  selectedWidgets: DashboardWidget[];
  timeZone?: string;
  significantDigits?: number;
};

export const ModeledExplorer = ({
  onUpdateQuery,
  iotSiteWiseClient,
  correctSelectionMode,
  addButtonDisabled,
  selectedWidgets,
  timeZone,
  significantDigits,
}: ModeledExplorerProps) => {
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    NonNullable<AssetPropertyExplorerProps['selectedAssetProperties']>
  >([]);

  const [selectedAlarms, setSelectedAlarms] = useState<
    NonNullable<AlarmExplorerProps['selectedAlarms']>
  >([]);

  const alarmsFeatureOn = true; //useGetConfigValue('useAlarms');

  const metricsRecorder = getPlugin('metricsRecorder');

  const resetPropertiesAndAlarms = () => {
    setSelectedAssetProperties([]);
    setSelectedAlarms([]);
  };

  function handleSelectAssets(
    assets: NonNullable<AssetExplorerProps['selectedAssets']>
  ) {
    setSelectedAssets(assets);
    resetPropertiesAndAlarms();
  }

  function handleClickAddModeledDataStreams(
    newModeledDataStreams: readonly AssetPropertyResource[],
    newAlarmDataStreams: readonly AlarmResource[]
  ) {
    onUpdateQuery((currentQuery) => {
      const extendtedAssetQuery = new QueryExtender(
        currentQuery
      ).extendAssetQueries(newModeledDataStreams);

      const extendedAlarmQuery = new QueryExtender(
        extendtedAssetQuery
      ).extendAlarmQueries(newAlarmDataStreams);

      return extendedAlarmQuery;
    });
  }

  const AssetExplorerComponent = (
    <AssetPropertyExplorer
      iotSiteWiseClient={iotSiteWiseClient}
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
      description='Select a modeled data stream to add to a widget.'
      timeZone={timeZone}
      significantDigits={significantDigits}
    />
  );

  return (
    <Box padding={{ horizontal: 's', bottom: 'm' }}>
      <AssetExplorer
        iotSiteWiseClient={iotSiteWiseClient}
        onSelectAsset={handleSelectAssets}
        selectedAssets={selectedAssets}
        selectionMode='single'
        tableSettings={{
          isSearchEnabled: true,
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
        description='Browse through your assets to select an asset, and view its associated data streams.'
        ariaLabels={{
          resizerRoleDescription: 'Resize button',
          itemSelectionLabel: (isNotSelected, asset: AssetResource) =>
            isNotSelected
              ? `Select asset ${asset.name}`
              : `Deselect asset ${asset.name}`,
        }}
      />
      {selectedAssets.length > 0 &&
        (alarmsFeatureOn ? (
          <>
            <ExpandableSection
              headerText={
                <ExpandableSectionHeading headerText='Data streams' />
              }
              defaultExpanded
            >
              {AssetExplorerComponent}
            </ExpandableSection>
            <ExpandableSection
              headerText={
                <ExpandableSectionHeading headerText='Alarm data streams' />
              }
            >
              <AlarmExplorer
                iotSiteWiseClient={iotSiteWiseClient}
                parameters={selectedAssets}
                selectionMode={correctSelectionMode}
                onSelectAlarm={setSelectedAlarms}
                selectedAlarms={selectedAlarms}
                tableSettings={{
                  isFilterEnabled: true,
                  isUserSettingsEnabled: true,
                }}
                ariaLabels={{
                  resizerRoleDescription: 'Resize button',
                  itemSelectionLabel: ({ selectedItems }, modeledDataStream) =>
                    alarmSelectionLabel([...selectedItems], modeledDataStream),
                }}
                description='Select an alarm to add to a selected widget.'
                timeZone={timeZone}
                significantDigits={significantDigits}
              />
            </ExpandableSection>
          </>
        ) : (
          AssetExplorerComponent
        ))}
      <ResourceExplorerFooter
        addDisabled={addButtonDisabled}
        onReset={resetPropertiesAndAlarms}
        onAdd={() => {
          handleClickAddModeledDataStreams(
            selectedAssetProperties,
            selectedAlarms
          );
          if (selectedAssetProperties.length > 0) {
            metricsRecorder?.record({
              metricName: 'ModeledDataStreamAdd',
              metricValue: 1,
            });
          }
          if (selectedAlarms.length > 0) {
            metricsRecorder?.record({
              metricName: 'AlarmStreamAdd',
              metricValue: 1,
            });
          }

          resetPropertiesAndAlarms();
        }}
      />
    </Box>
  );
};
