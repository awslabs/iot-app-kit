import React from 'react';

import { SizeAndPositionConfiguration } from './sizeAndPositionSettings';
import { TextSettingsConfiguration } from './textSettings';
import { AxisSettingsConfiguration } from './axisSettings';
import { ThresholdSettingsConfiguration } from './thresholdSettings';
import { PropertiesAndAlarmsSettingsConfiguration } from './propertiesAndAlarmsSettings';
import { AggregationsSettingsConfiguration } from './aggregationSettings';

export const propertiesSections = [
  <SizeAndPositionConfiguration />,
  <PropertiesAndAlarmsSettingsConfiguration />,
  <ThresholdSettingsConfiguration />,
  <AggregationsSettingsConfiguration />,
  <AxisSettingsConfiguration />,
  <TextSettingsConfiguration />,
];
