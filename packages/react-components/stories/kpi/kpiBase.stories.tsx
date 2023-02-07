import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { KpiBase } from '../../src/components/kpi/kpiBase';
import { DEFAULT_KPI_SETTINGS } from '../../src/components/kpi/constants';

export default {
  title: 'KPI visualization only',
  component: KpiBase,
  argTypes: {
    showName: { control: { type: 'boolean' }, defaultValue: DEFAULT_KPI_SETTINGS.showName },
    showUnit: { control: { type: 'boolean' }, defaultValue: DEFAULT_KPI_SETTINGS.showUnit },
    showTimestamp: { control: { type: 'boolean' }, defaultValue: DEFAULT_KPI_SETTINGS.showTimestamp },
    fontSize: { control: { type: 'number' }, defaultValue: DEFAULT_KPI_SETTINGS.fontSize },
    secondaryFontSize: { control: { type: 'number' }, defaultValue: DEFAULT_KPI_SETTINGS.secondaryFontSize },
    propertyPoint: { control: { type: 'object' }, defaultValue: { x: 123123213, y: 100 } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KpiBase>;

export const Main: ComponentStory<typeof KpiBase> = ({
  showName,
  showUnit,
  showTimestamp,
  fontSize,
  secondaryFontSize,
  ...args
}) => (
  <KpiBase
    name="Wind mill turbine"
    detailedName="Renton, WA Wind mill turbine #4"
    unit="mph"
    {...args}
    settings={{ showName, showUnit, showTimestamp, fontSize, secondaryFontSize }}
  />
);
