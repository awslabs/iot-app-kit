import React from 'react';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import Tabs from '@cloudscape-design/components/tabs';
import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { useQuery } from '../useQuery';
import { AssetModelDataStreamExplorer } from './assetModelDataStreamExplorer/assetModelDataStreamExplorer';
import { ModeledExplorer } from './modeledExplorer/modeledExplorer';
import { DashboardWidget } from '~/types';
import { UnmodeledExplorer } from './timeSeriesExplorer/timeSeriesExplorer';

export interface IoTSiteWiseQueryEditorProps {
  onUpdateQuery: ReturnType<typeof useQuery>[1];
  iotSiteWise: IoTSiteWise;
  selectedWidgets: DashboardWidget[];
  addButtonDisabled: boolean;
  correctSelectionMode: 'single' | 'multi';
}

export function IoTSiteWiseQueryEditor({
  onUpdateQuery,
  iotSiteWise,
  selectedWidgets,
  addButtonDisabled,
  correctSelectionMode,
}: IoTSiteWiseQueryEditorProps) {
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );
  const timeZone = useSelector((state: DashboardState) => state.timeZone);

  const modeledTab = {
    label: 'Modeled',
    id: 'explore-modeled-tab',
    content: (
      <ModeledExplorer
        onUpdateQuery={onUpdateQuery}
        iotSiteWise={iotSiteWise}
        correctSelectionMode={correctSelectionMode}
        addButtonDisabled={addButtonDisabled}
        selectedWidgets={selectedWidgets}
        timeZone={timeZone}
      />
    ),
  };

  const unmodeledTab = {
    label: 'Unmodeled',
    id: 'explore-unmodeled-tab',
    content: (
      <UnmodeledExplorer
        onUpdateQuery={onUpdateQuery}
        iotSiteWise={iotSiteWise}
        correctSelectionMode={correctSelectionMode}
        addButtonDisabled={addButtonDisabled}
        selectedWidgets={selectedWidgets}
      />
    ),
    disabled: isEdgeModeEnabled,
  };

  const assetModeledTab = {
    label: 'Dynamic assets',
    id: 'explore-asset-model-tab',
    content: (
      <AssetModelDataStreamExplorer
        client={iotSiteWise}
        correctSelectionMode={correctSelectionMode}
        addButtonDisabled={addButtonDisabled}
        selectedWidgets={selectedWidgets}
      />
    ),
  };

  const defaultTabs = [modeledTab, unmodeledTab, assetModeledTab];

  return <Tabs tabs={defaultTabs} />;
}
