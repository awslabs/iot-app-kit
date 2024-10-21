import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import React, { useLayoutEffect, useState } from 'react';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import { isJust } from '~/helpers/maybe';
import { useSelection } from '../../propertiesSection';
import { PropertiesAndAlarmsSettingsConfiguration } from '../propertiesAndAlarmsSettings';
import { ThresholdSettingsConfiguration } from '../thresholdSettings';
import { PropertiesPanelEmpty } from './emptyPanel';
import { StylesSection } from './styleTab';

/** Panel element responsible for rendering chart configuration sections. */
export const PropertiesPanel = () => {
  const selection = useSelection();
  const selectedWidgets = useSelectedWidgetIds();
  const selectedWidgetId = selectedWidgets[0];
  const [activeTabId, setActiveTabId] = useState('style');

  useLayoutEffect(() => {
    setActiveTabId('style'); // Default "Style" tab upon widget selection
  }, [selectedWidgetId]);

  return selection ? (
    <Box>
      <Tabs
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        activeTabId={activeTabId}
        disableContentPaddings
        tabs={[
          {
            label: 'Style',
            id: 'style',
            content: <StylesSection />,
          },
          {
            label: 'Properties',
            id: 'properties',
            disabled: isJust(selection.type) && selection.type.value === 'text',
            content: (
              <SpaceBetween size='xs' direction='vertical'>
                <PropertiesAndAlarmsSettingsConfiguration />
              </SpaceBetween>
            ),
          },
          {
            label: 'Thresholds',
            id: 'thresholds',
            disabled: isJust(selection.type) && selection.type.value === 'text',
            content: (
              <SpaceBetween size='xs' direction='vertical'>
                <ThresholdSettingsConfiguration />
              </SpaceBetween>
            ),
          },
        ]}
      />
    </Box>
  ) : (
    <PropertiesPanelEmpty />
  );
};
