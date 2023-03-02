import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DialBase } from '../../src/components/dial/dialBase';

export default {
  title: 'Dial base',
  component: DialBase,
  argTypes: {
    propertyPoint: { control: { type: 'object' }, defaultValue: { x: 123123213, y: 100.13 } },
    alarmPoint: { control: { type: 'object' }, defaultValue: { x: 123123213, y: 'Warning' } },
    yMin: { control: { type: 'number' }, defaultValue: 0 },
    yMax: { control: { type: 'number' }, defaultValue: 100 },
    showName: { control: { type: 'boolean' }, defaultValue: true },
    showUnit: { control: { type: 'boolean' }, defaultValue: true },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof DialBase>;

export const Main: ComponentStory<typeof DialBase> = ({ yMin, yMax, showName, showUnit, ...args }) => (
  <div style={{ width: '200px', height: '200px' }}>
    <DialBase {...args} settings={{ yMin, yMax, showName, showUnit }} />
  </div>
);
