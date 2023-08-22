import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';

import { SizeAndPositionConfiguration } from '../sizeAndPositionSettings';
import { AggregationsSettingsConfiguration } from '../aggregationSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { SettingsConfiguration } from '../settings';
import { TextSettingsConfiguration } from '../textSettings';

export const StylesSection = () => (
  <SpaceBetween size='xs' direction='vertical'>
    <SizeAndPositionConfiguration />
    <AggregationsSettingsConfiguration />
    <AxisSettingsConfiguration />
    <SettingsConfiguration />
    <TextSettingsConfiguration />
  </SpaceBetween>
);
