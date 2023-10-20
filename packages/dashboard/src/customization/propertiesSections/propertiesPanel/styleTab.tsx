import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';

import { AggregationsSettingsConfiguration } from '../aggregationSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { SettingsConfiguration } from '../settings';
import { TextSettingsConfiguration } from '../textSettings';
import { LineAndScatterStyleSettingsSection } from '../lineAndScatterStyleSettings/section';

export function StylesSection() {
  return (
    <SpaceBetween size='xs' direction='vertical'>
      <LineAndScatterStyleSettingsSection />
      <AggregationsSettingsConfiguration />
      <AxisSettingsConfiguration />
      <SettingsConfiguration />
      <TextSettingsConfiguration />
    </SpaceBetween>
  );
}
