import React from 'react';
import { STATUS_ICON_TYPE } from '@iot-app-kit/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { KpiBase } from '../../src/components/kpi/kpiBase';
import { KPISettings } from '../../src/components/kpi/types';
import type { DataPoint } from '@iot-app-kit/core';
import type { FC } from 'react';

export default {
  title: 'Widgets/KPI/KPI Base',
  component: KpiBase,
  argTypes: {
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
    showTimestamp: { control: { type: 'boolean' } },
    showUnit: { control: { type: 'boolean' } },
    isLoading: { control: { type: 'boolean' } },
    propertyPoint: { control: { type: 'object' }, defaultValue: { x: 123123213, y: 100 } },
    alarmPoint: { control: { type: 'object' } },
    fontSize: { control: { type: 'number' } },
    secondaryFontSize: { control: { type: 'number' } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KpiBase>;

type StoryInputs = KPISettings & { alarmPoint?: DataPoint; propertyPoint?: DataPoint };

export const Main: ComponentStory<FC<StoryInputs>> = ({
  showName,
  showUnit,
  showTimestamp,
  fontSize,
  secondaryFontSize,
  ...args
}) => <KpiBase {...args} settings={{ showName, showUnit, showTimestamp, fontSize, secondaryFontSize }} />;
