import { Box, ExpandableSection } from '@cloudscape-design/components';
import { getPlugin } from '@iot-app-kit/core';
import {
  AlarmExplorer,
  AlarmExplorerProps,
  AssetExplorer,
  AssetExplorerProps,
  AssetPropertyExplorer,
  AssetPropertyExplorerProps,
  AssetResource,
  useGetConfigValue,
} from '@iot-app-kit/react-components';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useClients } from '~/dashboard/clientContext';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import { alarmSelectionLabel } from '../../helpers/alarmSelectionLabel';
import { getCorrectSelectionMode } from '../../helpers/getCorrectSelectionMode';
import { isModeledPropertyInvalid } from '../../helpers/isModeledPropertyInvalid';
import { propertySelectionLabel } from '../../helpers/propertySelectionLabel';
import { useIsAddButtonDisabled } from '../../helpers/useIsAddButtonDisabled';
import { useQuery } from '../../useQuery';
import { ExpandableSectionHeading } from '../components/expandableSectionHeading';
import { ResourceExplorerFooter } from '../footer/footer';
import { QueryExtender } from '../queryExtender';

type ModeledExplorerProps = {
  timeZone?: string;
};

export const ModeledExplorer = memo(function ({
  timeZone,
}: ModeledExplorerProps) {
  const { iotSiteWise: iotSiteWiseClient } = useClients();
  const [_query, onUpdateQuery] = useQuery();
  const selectedWidgets = useSelectedWidgets();
  const [significantDigits] = useDashboardDecimalPlaces();
  const addButtonDisabled = useIsAddButtonDisabled(selectedWidgets);
  const correctSelectionMode = getCorrectSelectionMode(selectedWidgets);
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<AssetExplorerProps['selectedAssets']>
  >([]);

  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    NonNullable<AssetPropertyExplorerProps['selectedAssetProperties']>
  >([]);

  const [selectedAlarms, setSelectedAlarms] = useState<
    NonNullable<AlarmExplorerProps['selectedAlarms']>
  >([]);

  const alarmsFeatureOn = useGetConfigValue('useAlarms');

  const metricsRecorder = useMemo(() => getPlugin('metricsRecorder'), []);

  const resetPropertiesAndAlarms = useCallback(() => {
    setSelectedAssetProperties([]);
    setSelectedAlarms([]);
  }, []);

  const handleSelectAssets = useCallback(
    (assets: NonNullable<AssetExplorerProps['selectedAssets']>) => {
      setSelectedAssets(assets);
      resetPropertiesAndAlarms();
    },
    [resetPropertiesAndAlarms]
  );

  const handleClickAddModeledDataStreams = useCallback(() => {
    onUpdateQuery((currentQuery) => {
      const extendtedAssetQuery = new QueryExtender(
        currentQuery
      ).extendAssetQueries(selectedAssetProperties);

      const extendedAlarmQuery = new QueryExtender(
        extendtedAssetQuery
      ).extendAlarmQueries(selectedAlarms);

      return extendedAlarmQuery;
    });

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
  }, [
    onUpdateQuery,
    metricsRecorder,
    resetPropertiesAndAlarms,
    selectedAlarms,
    selectedAssetProperties,
  ]);

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
      description='Select a modeled datastream to add to a selected widget'
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
        description='Browse through your asset hierarchy and select an asset to view its associated data streams.'
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
                <ExpandableSectionHeading headerText='Data Streams' />
              }
              defaultExpanded
            >
              {AssetExplorerComponent}
            </ExpandableSection>
            <ExpandableSection
              headerText={
                <ExpandableSectionHeading headerText='Alarm Data Streams' />
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
                description='Select an alarm to add to a selected widget'
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
        onAdd={handleClickAddModeledDataStreams}
      />
    </Box>
  );
});
