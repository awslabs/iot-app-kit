import React from 'react';

import { AggregationsSettingsConfiguration } from '../aggregationSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { FormatDataConfiguration } from '../formatDataSettings';
import { TextSettingsConfiguration } from '../textSettings';
import { LineAndScatterStyleSettingsSection } from '../lineAndScatterStyleSettings/section';
import { WidgetTitle } from '../widgetTitle';
import { DisplaySettingsSection } from '../displaySettingsSection';
import { YAxisSettingSection } from '../yAxisSettingsSection';
import { FontsSettings } from '../fontsSettings';

export const StylesSection = () => (
  <div>
    <WidgetTitle />
    <AggregationsSettingsConfiguration />
    <FormatDataConfiguration />
    <LineAndScatterStyleSettingsSection />
    <DisplaySettingsSection />
    <AxisSettingsConfiguration />
    <YAxisSettingSection />
    <TextSettingsConfiguration />
    <FontsSettings />
  </div>
);
