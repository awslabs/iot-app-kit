import React from 'react';

import Box from '@cloudscape-design/components/box';
import Tabs from '@cloudscape-design/components/tabs';

import { useSelection } from '../../propertiesSection';

import { PropertiesPanelEmpty } from './emptyPanel';
import { StylesSection } from './styleTab';

import SpaceBetween from '@cloudscape-design/components/space-between';
import { PropertiesAndAlarmsSettingsConfiguration } from '../propertiesAndAlarmsSettings';
import { ThresholdSettingsConfiguration } from '../thresholdSettings';

/** Panel element responsible for rendering chart configuration sections. */
export const PropertiesPanel = () => {
  const selection = useSelection();

  return selection ? (
    <Box padding={{ horizontal: 'm', bottom: 'l' }}>
      <Tabs
        disableContentPaddings
        tabs={[
          {
            label: 'Style',
            id: 'style',
            content: <StylesSection />,
          },
          {
            label: 'Properties & Alarms',
            id: 'propertiesAndAlarms',
            content: (
              <SpaceBetween size='xs' direction='vertical'>
                <PropertiesAndAlarmsSettingsConfiguration />
              </SpaceBetween>
            ),
          },
          {
            label: 'Thresholds',
            id: 'thresholds',
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
