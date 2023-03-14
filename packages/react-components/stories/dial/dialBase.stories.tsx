import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DataPoint } from '@iot-app-kit/core';
import { DialBase } from '../../src/components/dial/dialBase';
import type { DialSettings } from '../../src/components/dial/types';
import type { FC } from 'react';

export default {
  title: 'Widgets/Dial/Dial base',
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

type StoryInputs = DialSettings & { alarmPoint?: DataPoint; propertyPoint?: DataPoint };

export const Main: ComponentStory<FC<StoryInputs>> = ({ yMin, yMax, showName, showUnit, ...args }) => (
  <div style={{ width: '200px', height: '200px' }}>
    <DialBase {...args} settings={{ yMin, yMax, showName, showUnit }} />
  </div>
);
