// eslint-disable-next-line import/default
import React, { FC } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GaugeBase } from '../../src/components/gauge/gaugeBase';
import { GaugeBaseProperties } from '../../src/components/gauge/types';

export default {
  title: 'Widgets/Gauge/Gauge Base',
  component: GaugeBase,
  argTypes: {
    propertyPoint: {
      control: { type: 'object' },
      defaultValue: { x: 123123213, y: 82 },
    },
    thresholds: {
      control: { type: 'object' },
      defaultValue: [
        { value: 30, color: 'red' },
        { value: 70, color: 'orange' },
        { value: 100, color: 'green' },
      ],
    },
    settings: {
      control: { type: 'object' },
      defaultValue: {
        gaugeThickness: 30,
        showName: false,
        showUnit: true,
        fontSize: 40,
        labelFontSize: 12,
        unitFontSize: 16,
        yMin: 0,
        yMax: 100,
      },
    },
    unit: {
      control: { type: 'text' },
      defaultValue: '%',
    },
    name: {
      control: { type: 'text' },
      defaultValue: 'Windmill',
    },
    isLoading: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    significantDigits: {
      control: { type: 'number' },
      defaultValue: 2,
    },
    error: {
      control: { type: 'text' },
      defaultValue: '',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof GaugeBase>;

type StoryInputs = GaugeBaseProperties;

export const Main: ComponentStory<FC<StoryInputs>> = ({
  propertyPoint,
  thresholds = [],
  settings,
  unit,
  name,
  isLoading,
  significantDigits,
  error,
}) => (
  <GaugeBase
    propertyPoint={propertyPoint}
    name={name}
    unit={unit}
    isLoading={isLoading}
    error={error}
    settings={settings}
    thresholds={thresholds}
    significantDigits={significantDigits}
  />
);
