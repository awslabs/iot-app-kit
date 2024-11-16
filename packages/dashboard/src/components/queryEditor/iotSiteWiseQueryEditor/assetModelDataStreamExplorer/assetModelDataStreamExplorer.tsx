import { useEffect, useState } from 'react';
import type { AssetSummary, IoTSiteWise } from '@aws-sdk/client-iotsitewise';

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
import { useModelBasedQuerySelection } from './modelBasedQuery/useModelBasedQuerySelection';
import { createAssetModelQuery } from './createAssetModelQuery';
import { getPlugin } from '@iot-app-kit/core';
import { ResourceExplorerFooter } from '../footer/footer';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { type DashboardWidget } from '~/types';
import {
  AlarmExplorer,
  type AlarmExplorerProps,
  type AssetResource,
} from '@iot-app-kit/react-components';
import { ExpandableSection } from '@cloudscape-design/components';
import { ExpandableSectionHeading } from '../components/expandableSectionHeading';
import { alarmSelectionLabel } from '../../helpers/alarmSelectionLabel';
import { createAlarmModelQuery } from './createAlarmModelQuery';

export interface AssetModelDataStreamExplorerProps {
  iotSiteWiseClient: IoTSiteWise;
  selectedWidgets: DashboardWidget[];
  addButtonDisabled: boolean;
  correctSelectionMode: 'single' | 'multi';
  timeZone?: string;
  significantDigits?: number;
  currentSelectedAsset?: AssetSummary;
}

export const AssetModelDataStreamExplorer = ({
  iotSiteWiseClient,
  selectedWidgets,
  addButtonDisabled,
  correctSelectionMode,
  timeZone,
  significantDigits,
  currentSelectedAsset,
}: AssetModelDataStreamExplorerProps) => {
  const metricsRecorder = getPlugin('metricsRecorder');

  const alarmsFeatureOn = true; //useGetConfigValue('useAlarms');

  const {
    assetModelId,
    assetIds,
    clearModelBasedWidgets,
    updateSelectedAsset,
  } = useModelBasedQuery();

  const { updateModelQueries } = useModelBasedQuerySelection();

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
      (selectedAssetModel[0].assetModelId &&
        selectedAssetModelProperties.length > 0) ||
      selectedAlarms.length > 0
    ) {
      updateModelQueries({
        alarmModels: createAlarmModelQuery({
          assetModelId: selectedAssetModel[0].assetModelId,
          assetId: selectedAsset?.at(0)?.assetId,
          alarms: selectedAlarms,
        }),
        assetModels: createAssetModelQuery({
          assetModelId: selectedAssetModel[0].assetModelId,
          assetId: selectedAsset?.at(0)?.assetId,
          assetModelPropertyIds: createNonNullableList(
            selectedAssetModelProperties.map(({ propertyId }) => propertyId)
          ),
        }),
      });

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

          {alarmsFeatureOn ? (
            <>
              <ExpandableSection
                headerText={
                  <ExpandableSectionHeading headerText='Data streams' />
                }
                defaultExpanded
              >
                <AssetModelPropertiesExplorer
                  {...assetModelPropertiesExplorerProps}
                />
              </ExpandableSection>
              <ExpandableSection
                headerText={
                  <ExpandableSectionHeading headerText='Alarm data streams' />
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
                  description='Select an alarm to add to a selected widget.'
                  timeZone={timeZone}
                  significantDigits={significantDigits}
                />
              </ExpandableSection>
            </>
          ) : (
            <AssetModelPropertiesExplorer
              {...assetModelPropertiesExplorerProps}
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
};
