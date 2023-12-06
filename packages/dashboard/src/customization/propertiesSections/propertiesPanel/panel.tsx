import React from 'react';
import Box from '@cloudscape-design/components/box';
import Tabs from '@cloudscape-design/components/tabs';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useSelection } from '../../propertiesSection';
import { PropertiesPanelEmpty } from './emptyPanel';
import { StylesSection } from './styleTab';
import { PropertiesAndAlarmsSettingsConfiguration } from '../propertiesAndAlarmsSettings';
import { ThresholdSettingsConfiguration } from '../thresholdSettings';
import { isJust } from '~/util/maybe';

/** Panel element responsible for rendering chart configuration sections. */
export const PropertiesPanel = () => {
  const selection = useSelection();

  return selection ? (
    <Box>
      <Tabs
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
