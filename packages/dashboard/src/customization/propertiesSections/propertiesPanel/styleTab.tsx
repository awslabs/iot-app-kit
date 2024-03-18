import React from 'react';

import { AggregationsSettingsConfiguration } from '../aggregationSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { SettingsConfiguration } from '../settings';
import { TextSettingsConfiguration } from '../textSettings';
import { LineAndScatterStyleSettingsSection } from '../lineAndScatterStyleSettings/section';
import { WidgetTitle } from '../widgetTitle';
import { DisplaySettingsSection } from '../displaySettingsSection';

export const StylesSection = () => (
  <div>
    <WidgetTitle />
    <LineAndScatterStyleSettingsSection />
    <DisplaySettingsSection />
    <AggregationsSettingsConfiguration />
    <AxisSettingsConfiguration />
    <SettingsConfiguration />
    <TextSettingsConfiguration />
  </div>
);
