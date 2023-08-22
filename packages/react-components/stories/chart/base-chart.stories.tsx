import React, { FC } from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from './mock-data';
import { TimeSelection, TimeSync, useViewport, Chart } from '../../src';
import { getTimeSeriesDataQuery, queryConfigured } from '../utils/query';
import { ChartOptions, Visualization } from '../../src/components/chart/types';

const chartTypes: Visualization[] = ['line', 'scatter', 'bar', 'step-start', 'step-middle', 'step-end'];
export default {
  title: 'Widgets/Base Chart',
  component: Chart,
  argTypes: {
    id: { control: { type: 'text' }, defaultValue: undefined },
    defaultVisualizationType: {
      control: 'select',
      options: chartTypes,
      defaultValue: undefined,
    },
    significantDigits: { control: { type: 'number', defaultValue: undefined } },
    size: { control: { type: 'object' }, defaultValue: { width: 800, height: 500 } },
    styleSettings: { control: { type: 'object' }, defaultValue: undefined },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Chart>;

type StoryInputs = ChartOptions;

export const BaseChartExample: ComponentStory<FC<StoryInputs>> = ({ id, significantDigits, size, styleSettings }) => {
  const { viewport } = useViewport();

  return (
    <TimeSync>
      <div id='story-container' style={{ width: '100vw', height: '100vh' }}>
        <TimeSelection />
        <br />
        {chartTypes.map((chartType, index) => (
          <>
            <h3>{chartType}</h3>
            <Chart
              key={index}
              id={id}
              defaultVisualizationType={chartType}
              significantDigits={significantDigits}
              size={size}
              styleSettings={styleSettings}
              viewport={viewport ?? VIEWPORT}
              queries={[MOCK_TIME_SERIES_DATA_QUERY]}
              theme='light'
            />
          </>
        ))}
      </div>
    </TimeSync>
  );
};

export const SiteWiseConnectedBaseChartExample: ComponentStory<FC<StoryInputs>> = ({
  id,
  significantDigits,
  size,
  styleSettings,
}) => {
  if (!queryConfigured()) {
    return (
      <div>
        <h1>All required Env variables not set</h1>
        <p>Required:</p>
        <ul>
          <li>AWS_ACCESS_KEY_ID</li>
          <li>AWS_SECRET_ACCESS_KEY</li>
          <li>AWS_SESSION_TOKEN</li>
          <li>AWS_REGION</li>
          <li>ASSET_ID_1</li>
          <li>PROPERTY_ID_1</li>
          <li>PROPERTY_ID_2</li>
          <li>PROPERTY_ID_3</li>
        </ul>
      </div>
    );
  }

  const { viewport } = useViewport();

  return (
    <TimeSync>
      <div id='story-container' style={{ width: '100vw', height: '100vh' }}>
        <TimeSelection />
        <br />
        {chartTypes.map((chartType, index) => (
          <Chart
            key={index}
            id={id}
            defaultVisualizationType={chartType}
            significantDigits={significantDigits}
            size={size}
            styleSettings={styleSettings}
            viewport={viewport ?? { duration: '5m' }}
            queries={[getTimeSeriesDataQuery()]}
            theme='light'
          />
        ))}
      </div>
    </TimeSync>
  );
};
