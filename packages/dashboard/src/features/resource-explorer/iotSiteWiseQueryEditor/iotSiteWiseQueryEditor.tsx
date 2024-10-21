import Tabs from '@cloudscape-design/components/tabs';
import React, { memo, useMemo } from 'react';
import { AssetModelDataStreamExplorer } from './assetModelDataStreamExplorer/assetModelDataStreamExplorer';
import { ModeledExplorer } from './modeledExplorer/modeledExplorer';
import { UnmodeledExplorer } from './timeSeriesExplorer/timeSeriesExplorer';

export const IoTSiteWiseQueryEditor = memo(function () {
  const isEdgeModeEnabled = false;
  const timeZone = '';

  const defaultTabs = useMemo(
    () => [
      {
        label: 'Modeled',
        id: 'explore-modeled-tab',
        content: <ModeledExplorer timeZone={timeZone} />,
      },
      {
        label: 'Unmodeled',
        id: 'explore-unmodeled-tab',
        content: <UnmodeledExplorer timeZone={timeZone} />,
        disabled: isEdgeModeEnabled,
      },
      {
        label: 'Dynamic assets',
        id: 'explore-asset-model-tab',
        content: <AssetModelDataStreamExplorer timeZone={timeZone} />,
      },
    ],
    [isEdgeModeEnabled]
  );

  return <Tabs tabs={defaultTabs} />;
});
