import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { KpiBase } from '../../src/kpi/kpiBase';
import { DataStream } from '@iot-app-kit/core';
import { COMPARISON_OPERATOR } from '../../src/common/constants';
import { Threshold } from '../../src/common/thresholdTypes';

export default {
  title: 'KPI',
  component: KpiBase,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KpiBase>;

const DATA_STREAM: DataStream = {
  id: '123',
  name: 'Windmill turbine RPM',
  resolution: 0,
  data: [{ x: 123, y: 100 }],
  unit: 'mph',
  color: 'black',
};

const EMPTY_DATA_STREAM: DataStream = {
  id: '123',
  name: 'Windmill turbine RPM',
  resolution: 0,
  data: [],
  unit: 'mph',
  color: 'black',
};

const ERROR_DATA_STREAM: DataStream = {
  id: '123',
  name: 'Windmill turbine RPM',
  error: { msg: 'sev1!' },
  resolution: 0,
  data: [{ x: 123, y: 100 }],
  unit: 'mph',
  color: 'black',
};
const THRESHOLD_VALUE = 20;
const THRESHOLD: Threshold = {
  color: 'purple',
  value: THRESHOLD_VALUE,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
};

export const Main: ComponentStory<typeof KpiBase> = () => (
  <KpiBase propertyStream={DATA_STREAM} propertyPoint={DATA_STREAM.data[0]} valueColor="black" />
);
export const Empty: ComponentStory<typeof KpiBase> = () => (
  <KpiBase propertyStream={EMPTY_DATA_STREAM} propertyPoint={undefined} valueColor="black" />
);
export const Loading: ComponentStory<typeof KpiBase> = () => (
  <KpiBase isLoading propertyStream={DATA_STREAM} propertyPoint={DATA_STREAM.data[0]} valueColor="black" />
);
export const Error: ComponentStory<typeof KpiBase> = () => (
  <KpiBase propertyStream={ERROR_DATA_STREAM} propertyPoint={DATA_STREAM.data[0]} valueColor="black" />
);
export const Breached: ComponentStory<typeof KpiBase> = () => (
  <KpiBase
    propertyStream={DATA_STREAM}
    propertyPoint={DATA_STREAM.data[0]}
    breachedThreshold={THRESHOLD}
    valueColor="black"
  />
);
