import React, { FC } from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from './mock-data';
import { TimeSelection, TimeSync, useViewport, Chart } from '../../src';
import { getTimeSeriesDataQuery, queryConfigured } from '../utils/query';
import { ChartOptions, Visualization } from '../../src/components/chart/types';

const chartTypes: Visualization[] = [
  'line',
  'scatter',
  'step-end',
  'step-middle',
  'step-start',
]; // removing bar for now
export default {
  title: 'Widgets/Base Chart',
  component: Chart,
  argTypes: {
    showAllVisualizationTypes: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    id: { control: { type: 'text' }, defaultValue: undefined },
    titleText: { control: { type: 'text' }, defaultValue: undefined },
    defaultVisualizationType: {
      control: 'select',
      options: chartTypes,
      defaultValue: undefined,
    },
    significantDigits: { control: { type: 'number', defaultValue: undefined } },
    size: {
      control: { type: 'object' },
      defaultValue: { width: 800, height: 500 },
    },
    styleSettings: { control: { type: 'object' }, defaultValue: undefined },
    axis: { control: { type: 'object' }, defaultValue: undefined },
    thresholds: { control: { type: 'object' }, defaultValue: [] },
    legend: { control: { type: 'object' }, defaultValue: { visible: true } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Chart>;

type StoryInputs = ChartOptions & { showAllVisualizationTypes: boolean };

export const BaseChartExample: ComponentStory<FC<StoryInputs>> = ({
  id,
  significantDigits,
  size,
  styleSettings,
  legend,
}) => {
  const { viewport } = useViewport();

  return (
    <TimeSync initialViewport={VIEWPORT}>
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
            onChartOptionsChange={() => {}}
            styleSettings={styleSettings}
            viewport={viewport ?? VIEWPORT}
            queries={[MOCK_TIME_SERIES_DATA_QUERY]}
            theme='light'
            legend={legend}
          />
        ))}
      </div>
    </TimeSync>
  );
};

export const SiteWiseConnectedBaseChartExample: ComponentStory<
  FC<StoryInputs>
> = ({
  showAllVisualizationTypes,
  id,
  significantDigits,
  titleText,
  defaultVisualizationType,
  size,
  styleSettings,
  axis,
  thresholds,
  legend,
}) => {
  const { viewport } = useViewport();

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

  const options = {
    id,
    titleText,
    defaultVisualizationType,
    significantDigits,
    size,
    styleSettings,
    viewport,
    theme: 'light',
    axis,
    thresholds,
    legend,
  };

  return (
    <TimeSync>
      <div id='story-container' style={{ width: '100vw', height: '100vh' }}>
        <TimeSelection />
        <br />
        {showAllVisualizationTypes ? (
          chartTypes.map((chartType, index) => (
            <Chart
              {...options}
              key={index}
              defaultVisualizationType={chartType}
              queries={[getTimeSeriesDataQuery()]}
            />
          ))
        ) : (
          <Chart {...options} queries={[getTimeSeriesDataQuery()]} />
        )}
      </div>
    </TimeSync>
  );
};
