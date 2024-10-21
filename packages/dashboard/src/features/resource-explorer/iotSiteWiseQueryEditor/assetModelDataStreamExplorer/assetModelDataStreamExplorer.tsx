import React, { memo, useEffect, useMemo, useState } from 'react';

import Box from '@cloudscape-design/components/box';

import { ExpandableSection } from '@cloudscape-design/components';
import { getPlugin } from '@iot-app-kit/core';
import {
  AlarmExplorer,
  AlarmExplorerProps,
  AssetResource,
  useGetConfigValue,
} from '@iot-app-kit/react-components';
import { HorizontalDivider } from '~/atoms/divider/horizontalDivider';
import { useClients } from '~/dashboard/clientContext';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import { createNonNullableList } from '~/helpers/lists';
import { alarmSelectionLabel } from '../../helpers/alarmSelectionLabel';
import { getCorrectSelectionMode } from '../../helpers/getCorrectSelectionMode';
import { useIsAddButtonDisabled } from '../../helpers/useIsAddButtonDisabled';
import { ExpandableSectionHeading } from '../components/expandableSectionHeading';
import { ResourceExplorerFooter } from '../footer/footer';
import { AssetModelExplorer } from './assetModelExplorer/assetModelExplorer';
import { AssetModelPropertiesExplorer } from './assetModelPropertiesExplorer/assetModelPropertiesExplorer';
import { useAssetsForAssetModel } from './assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';
import { createAlarmModelQuery } from './createAlarmModelQuery';
import { createAssetModelQuery } from './createAssetModelQuery';
import { useModelBasedQuery } from './modelBasedQuery/useModelBasedQuery';
import { useModelBasedQuerySelection } from './modelBasedQuery/useModelBasedQuerySelection';
import {
  createInitialAssetResource,
  useSelectedAsset,
} from './useSelectedAsset';
import {
  createInitialAssetModelResource,
  useSelectedAssetModel,
} from './useSelectedAssetModel';
import {
  createInitialAssetModelProperties,
  useSelectedAssetModelProperties,
} from './useSelectedAssetModelProperties';

export interface AssetModelDataStreamExplorerProps {
  timeZone?: string;
}

export const AssetModelDataStreamExplorer = memo(function ({
  timeZone,
}: AssetModelDataStreamExplorerProps) {
  const { iotSiteWise: iotSiteWiseClient } = useClients();
  const selectedWidgets = useSelectedWidgets();
  const [significantDigits] = useDashboardDecimalPlaces();
  const addButtonDisabled = useIsAddButtonDisabled(selectedWidgets);
  const correctSelectionMode = getCorrectSelectionMode(selectedWidgets);
  const metricsRecorder = getPlugin('metricsRecorder');
  const alarmsFeatureOn = useGetConfigValue('useAlarms');

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

  const currentSelectedAsset = useMemo(
    () => assetSummaries.find(({ id }) => id === assetIds?.at(0)),
    [assetIds, assetSummaries]
  );

  const { updateAssetModels, uppdateAssetAlarmModels } =
    useModelBasedQuerySelection();

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
    useSelectedAssetModelProperties(createInitialAssetModelProperties([]));

  const [selectedAlarms, setSelectedAlarms] = useState<
    NonNullable<AlarmExplorerProps['selectedAlarms']>
  >([]);

  /**
   * update every model based query widget
   * when the selected asset changes
   */
  useEffect(() => {
    updateSelectedAsset(selectedAsset[0]);
    selectAssetModelProperties([]); // if selectedAsset changes, dont keep state from old selection in RE
  }, [updateSelectedAsset, selectedAsset, selectAssetModelProperties]);

  const onReset = () => {
    selectAssetModel([]);
    selectAsset([]);
    selectAssetModelProperties([]);
    setSelectedAlarms([]);
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

    if (selectedAlarms.length > 0) {
      uppdateAssetAlarmModels(
        createAlarmModelQuery({
          assetModelId: selectedAssetModel[0].assetModelId,
          assetId: selectedAsset?.at(0)?.assetId,
          alarms: selectedAlarms,
        })
      );
    }
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

          {alarmsFeatureOn ? (
            <>
              <ExpandableSection
                headerText={
                  <ExpandableSectionHeading headerText='Data Streams' />
                }
                defaultExpanded
              >
                <AssetModelPropertiesExplorer
                  iotSiteWiseClient={iotSiteWiseClient}
                  selectedAsset={selectedAsset}
                  selectedAssetModelProperties={selectedAssetModelProperties}
                  selectAssetModelProperties={selectAssetModelProperties}
                  selectedWidgets={selectedWidgets}
                  timeZone={timeZone}
                  significantDigits={significantDigits}
                  correctSelectionMode={correctSelectionMode}
                />
              </ExpandableSection>
              <ExpandableSection
                headerText={
                  <ExpandableSectionHeading headerText='Alarm Data Streams' />
                }
              >
                <AlarmExplorer
                  iotSiteWiseClient={iotSiteWiseClient}
                  parameters={
                    selectedAsset.length > 0
                      ? selectedAsset
                      : selectedAssetModel
                  }
                  selectionMode={correctSelectionMode}
                  onSelectAlarm={setSelectedAlarms}
                  selectedAlarms={selectedAlarms}
                  tableSettings={{
                    isFilterEnabled: true,
                    isUserSettingsEnabled: true,
                  }}
                  ariaLabels={{
                    resizerRoleDescription: 'Resize button',
                    itemSelectionLabel: (
                      { selectedItems },
                      modeledDataStream
                    ) =>
                      alarmSelectionLabel(
                        [...selectedItems],
                        modeledDataStream
                      ),
                  }}
                  description='Select an alarm to add to a selected widget'
                  timeZone={timeZone}
                  significantDigits={significantDigits}
                />
              </ExpandableSection>
            </>
          ) : (
            <AssetModelPropertiesExplorer
              iotSiteWiseClient={iotSiteWiseClient}
              selectedAsset={selectedAsset}
              selectedAssetModelProperties={selectedAssetModelProperties}
              selectAssetModelProperties={selectAssetModelProperties}
              selectedWidgets={selectedWidgets}
              timeZone={timeZone}
              significantDigits={significantDigits}
              correctSelectionMode={correctSelectionMode}
            />
          )}

          <ResourceExplorerFooter
            addDisabled={addButtonDisabled}
            onReset={() => {
              selectAssetModelProperties([]);
              setSelectedAlarms([]);
            }}
            onAdd={() => {
              onSave();
              selectAssetModelProperties([]); //clear table after adding it to widget
              setSelectedAlarms([]);
            }}
          />
        </>
      )}
    </Box>
  );
});
