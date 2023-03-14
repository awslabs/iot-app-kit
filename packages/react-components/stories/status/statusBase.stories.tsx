import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { STATUS_ICON_TYPE } from '@iot-app-kit/core';
import { StatusBase } from '../../src/components/status/statusBase';
import type { FC } from 'react';
import type { DataPoint } from '@iot-app-kit/core';
import type { StatusSettings } from '../../src/components/status/types';

export default {
  title: 'Widgets/Status/Status base',
  component: StatusBase,
  argTypes: {
    propertyPoint: { control: { type: 'object' }, defaultValue: { x: 123123213, y: 100 } },
    alarmPoint: { control: { type: 'object' } },
    name: { control: { type: 'text' }, defaultValue: 'Windmill' },
    error: { control: { type: 'text' } },
    color: { control: { type: 'color' } },
    unit: { control: { type: 'text' } },
    icon: {
      control: { type: 'radio' },
      options: [...Object.values(STATUS_ICON_TYPE), undefined],
      defaultValue: undefined,
    },
    showName: { control: { type: 'boolean' } },
    showValue: { control: { type: 'boolean' } },
    showUnit: { control: { type: 'boolean' } },
    isLoading: { control: { type: 'boolean' } },
    fontSize: { control: { type: 'number' } },
    secondaryFontSize: { control: { type: 'number' } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof StatusBase>;

type StoryInputs = StatusSettings & { alarmPoint?: DataPoint; propertyPoint?: DataPoint };

export const Main: ComponentStory<FC<StoryInputs>> = ({
  showName,
  showValue,
  showUnit,
  fontSize,
  secondaryFontSize,
  ...args
}) => (
  <div style={{ width: '200px', height: '200px' }}>
    <StatusBase {...args} settings={{ showName, showValue, showUnit, fontSize, secondaryFontSize }} />
  </div>
);
