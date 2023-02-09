import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { StatusBase } from '../../src/status/statusBase';
import { DEFAULT_STATUS_SETTINGS } from '../../src/status/constants';

export default {
  title: 'Status',
  component: StatusBase,
  argTypes: {
    name: { control: { type: 'string' }, defaultValue: 'Windmill turbine #3' },
    unit: { control: { type: 'string' }, defaultValue: 'mph' },
    showName: { control: { type: 'boolean' }, defaultValue: DEFAULT_STATUS_SETTINGS.showName },
    showUnit: { control: { type: 'boolean' }, defaultValue: DEFAULT_STATUS_SETTINGS.showUnit },
    showValue: { control: { type: 'boolean' }, defaultValue: DEFAULT_STATUS_SETTINGS.showValue },
    showTimestamp: { control: { type: 'boolean' }, defaultValue: DEFAULT_STATUS_SETTINGS.showTimestamp },
    fontSize: { control: { type: 'number' }, defaultValue: DEFAULT_STATUS_SETTINGS.fontSize },
    propertyPoint: { control: { type: 'object' }, defaultValue: { x: 123123213, y: 100 } },
    alarmPoint: { control: { type: 'object' }, defaultValue: { x: 123123213, y: 'WARNING' } },
    containerWidth: { control: { type: 'number' }, defaultValue: 200 },
    containerHeight: { control: { type: 'number' }, defaultValue: 200 },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof StatusBase>;

export const Main: ComponentStory<typeof StatusBase> = ({
  showName,
  showValue,
  showUnit,
  showTimestamp,
  fontSize,
  secondaryFontSize,
  containerWidth,
  containerHeight,
  ...args
}) => (
  <div style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
    <StatusBase {...args} settings={{ showName, showValue, showUnit, showTimestamp, fontSize, secondaryFontSize }} />
  </div>
);
