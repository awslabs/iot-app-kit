import React from 'react';

import { FormatDataConfiguration } from '../formatDataSettings';
import { AxisSettingsConfiguration } from '../axisSettings';
import { TextSettingsConfiguration } from '../textSettings';
import { LineAndScatterStyleSettingsSection } from '../lineAndScatterStyleSettings/section';
import { WidgetTitle } from '../widgetTitle';
import { DisplaySettingsSection } from '../displaySettingsSection';

export const StylesSection = () => (
  <div>
    <WidgetTitle />
    <FormatDataConfiguration />
    <LineAndScatterStyleSettingsSection />
    <DisplaySettingsSection />
    <AxisSettingsConfiguration />
    <TextSettingsConfiguration />
  </div>
);
