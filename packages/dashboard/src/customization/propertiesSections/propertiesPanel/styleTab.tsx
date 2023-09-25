import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';

import { SizeAndPositionConfiguration } from '../sizeAndPositionSettings';
import { AggregationsSettingsConfiguration } from '../aggregationSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { SettingsConfiguration } from '../settings';
import { TextSettingsConfiguration } from '../textSettings';
import { LineAndScatterStyleSettingsSection } from '../lineAndScatterStyleSettings/section';

export const StylesSection = () => (
  <div>
    <SpaceBetween size='xs' direction='vertical'>
      <SizeAndPositionConfiguration />
      <LineAndScatterStyleSettingsSection />
      <AggregationsSettingsConfiguration />
      <AxisSettingsConfiguration />
      <SettingsConfiguration />
      <TextSettingsConfiguration />
    </SpaceBetween>
  </div>
);
