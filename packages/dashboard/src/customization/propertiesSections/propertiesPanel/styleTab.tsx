import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';

import { AggregationsSettingsConfiguration } from '../aggregationSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { SettingsConfiguration } from '../settings';
import { TextSettingsConfiguration } from '../textSettings';
import { LineAndScatterStyleSettingsSection } from '../lineAndScatterStyleSettings/section';
import { WidgetTitle } from '../widgetTitle';

export const StylesSection = () => (
  <div>
    <SpaceBetween size='s' direction='vertical'>
      <WidgetTitle />
      <LineAndScatterStyleSettingsSection />
      <AggregationsSettingsConfiguration />
      <AxisSettingsConfiguration />
      <SettingsConfiguration />
      <TextSettingsConfiguration />
    </SpaceBetween>
  </div>
);
