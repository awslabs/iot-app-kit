import Tabs from '@cloudscape-design/components/tabs';
import React from 'react';

import { NoWidgetSelected } from './noWidgetSelected';
import { StylesSection } from './styleTab';
import { PropertiesAndAlarmsSettingsConfiguration } from '../propertiesAndAlarmsSettings';
import { ThresholdSettingsConfiguration } from '../thresholdSettings';
import { useSelection } from '../../propertiesSection';

/** Panel element responsible for rendering chart configuration sections. */
export const PropertiesPanel = () => {
  const selection = useSelection();
  // @ts-expect-error TODO: fix type
  const selectedWidget = selection?.type?.value;

  // TODO: Hide tabs for text widget

  return selection ? (
    <Tabs
      tabs={[
        {
          label: 'Style',
          id: 'style',
          content: <StylesSection />,
        },
        {
          label: 'Properties',
          id: 'properties',
          content: <PropertiesAndAlarmsSettingsConfiguration />,
        },
        {
          label: 'Thresholds',
          id: 'thresholds',
          content: <ThresholdSettingsConfiguration />,
        },
      ]}
    />
  ) : (
    <NoWidgetSelected />
  );
};
