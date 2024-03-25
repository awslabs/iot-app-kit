import React from 'react';

import { AggregationsSettingsConfiguration } from '../aggregationSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { FormatDataConfiguration } from '../formatDataSettings';
import { TextSettingsConfiguration } from '../textSettings';
import { LineAndScatterStyleSettingsSection } from '../lineAndScatterStyleSettings/section';
import { WidgetTitle } from '../widgetTitle';
import { DisplaySettingsSection } from '../displaySettingsSection';

export const StylesSection = () => (
  <div>
    <WidgetTitle />
    <AggregationsSettingsConfiguration />
    <FormatDataConfiguration />
    <LineAndScatterStyleSettingsSection />
    <DisplaySettingsSection />
    <AxisSettingsConfiguration />
    <TextSettingsConfiguration />
  </div>
);
