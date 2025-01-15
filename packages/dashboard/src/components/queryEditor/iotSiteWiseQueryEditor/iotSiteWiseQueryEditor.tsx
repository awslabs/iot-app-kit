import {
  type AssetSummary,
  type IoTSiteWise,
} from '@aws-sdk/client-iotsitewise';
import Tabs from '@cloudscape-design/components/tabs';
import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { type useQuery } from '../useQuery';
import { AssetModelDataStreamExplorer } from './assetModelDataStreamExplorer/assetModelDataStreamExplorer';
import { ModeledExplorer } from './modeledExplorer/modeledExplorer';
import { type DashboardWidget } from '~/types';
import { UnmodeledExplorer } from './timeSeriesExplorer/timeSeriesExplorer';

export interface IoTSiteWiseQueryEditorProps {
  onUpdateQuery: ReturnType<typeof useQuery>[1];
  iotSiteWiseClient: IoTSiteWise;
  selectedWidgets: DashboardWidget[];
  addButtonDisabled: boolean;
  correctSelectionMode: 'single' | 'multi';
  currentSelectedAsset?: AssetSummary;
}

export function IoTSiteWiseQueryEditor({
  onUpdateQuery,
  iotSiteWiseClient,
  selectedWidgets,
  addButtonDisabled,
  correctSelectionMode,
  currentSelectedAsset,
}: IoTSiteWiseQueryEditorProps) {
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );
  const timeZone = useSelector((state: DashboardState) => state.timeZone);
  const significantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

  const modeledTab = {
    label: 'Modeled',
    id: 'explore-modeled-tab',
    content: (
      <ModeledExplorer
        onUpdateQuery={onUpdateQuery}
        iotSiteWiseClient={iotSiteWiseClient}
        correctSelectionMode={correctSelectionMode}
        addButtonDisabled={addButtonDisabled}
        selectedWidgets={selectedWidgets}
        timeZone={timeZone}
        significantDigits={significantDigits}
      />
    ),
  };

  const unmodeledTab = {
    label: 'Unmodeled',
    id: 'explore-unmodeled-tab',
    content: (
      <UnmodeledExplorer
        onUpdateQuery={onUpdateQuery}
        iotSiteWiseClient={iotSiteWiseClient}
        correctSelectionMode={correctSelectionMode}
        addButtonDisabled={addButtonDisabled}
        selectedWidgets={selectedWidgets}
        timeZone={timeZone}
        significantDigits={significantDigits}
      />
    ),
    disabled: isEdgeModeEnabled,
  };

  const assetModeledTab = {
    label: 'Dynamic assets',
    id: 'explore-asset-model-tab',
    content: (
      <AssetModelDataStreamExplorer
        iotSiteWiseClient={iotSiteWiseClient}
        correctSelectionMode={correctSelectionMode}
        addButtonDisabled={addButtonDisabled}
        selectedWidgets={selectedWidgets}
        timeZone={timeZone}
        significantDigits={significantDigits}
        currentSelectedAsset={currentSelectedAsset}
      />
    ),
  };

  const defaultTabs = [modeledTab, unmodeledTab, assetModeledTab];

  return <Tabs tabs={defaultTabs} />;
}
