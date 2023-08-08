import React, { FC, useState } from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from './mock-data';
import { TimeSelection, TimeSync, useViewport } from '../../src';
import Chart from '../../src/components/chart';
import { getTimeSeriesDataQuery, queryConfigured } from '../utils/query';
import { ChartOptions } from '../../src/components/chart/types';
import { SiteWiseDataStreamQuery } from '@iot-app-kit/source-iotsitewise';

export default {
  title: 'Widgets/Base Chart',
  component: Chart,
  argTypes: {
    id: { control: { type: 'text' }, defaultValue: undefined },
    defaultVisualizationType: {
      control: 'select',
      options: ['line', 'scatter', 'bar', 'step-start', 'step-middle', 'step-end'],
      defaultValue: undefined,
    },
    size: { control: { type: 'object' }, defaultValue: { width: 800, height: 500 } },
    styleSettings: { control: { type: 'object' }, defaultValue: undefined },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Chart>;

type StoryInputs = ChartOptions;

export const BaseChartExample: ComponentStory<FC<StoryInputs>> = ({
  id,
  defaultVisualizationType,
  size,
  styleSettings,
}) => {
  const { viewport } = useViewport();

  return (
    <TimeSync>
      <div id='story-container' style={{ width: '100vw', height: '100vh' }}>
        <TimeSelection />
        <Chart
          id={id}
          defaultVisualizationType={defaultVisualizationType}
          size={size}
          styleSettings={styleSettings}
          viewport={viewport ?? VIEWPORT}
          queries={[MOCK_TIME_SERIES_DATA_QUERY]}
          theme='light'
        />
        <Chart
          id={id}
          defaultVisualizationType='bar'
          size={size}
          styleSettings={styleSettings}
          viewport={viewport ?? VIEWPORT}
          queries={[MOCK_TIME_SERIES_DATA_QUERY]}
          theme='light'
        />
      </div>
    </TimeSync>
  );
};

export const SiteWiseConnectedBaseChartExample: ComponentStory<FC<StoryInputs>> = ({
  id,
  defaultVisualizationType,
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

  const [n, sn] = useState(0);

  const q0: SiteWiseDataStreamQuery = {
    assets: [
      {
        assetId: '934b3a57-8425-4cba-8e35-580a08b592f3',
        properties: [],
      },
    ],
  };
  // const q1: SiteWiseDataStreamQuery = {
  //   assets: [
  //     {
  //       assetId: '934b3a57-8425-4cba-8e35-580a08b592f3',
  //       properties: [
  //         {
  //           propertyId: '1e7f3d8a-a0f6-49e5-a7cb-4920fb955c53',
  //           aggregationType: 'AVERAGE',
  //           resolution: '1m',
  //         },
  //       ],
  //     },
  //   ],
  // };
  // const q2: SiteWiseDataStreamQuery = {
  //   assets: [
  //     {
  //       assetId: '934b3a57-8425-4cba-8e35-580a08b592f3',
  //       properties: [
  //         {
  //           propertyId: '1e7f3d8a-a0f6-49e5-a7cb-4920fb955c53',
  //           aggregationType: 'AVERAGE',
  //           resolution: '1m',
  //         },
  //         {
  //           propertyId: 'a102500c-cf7a-4856-86fe-b4a3a6962299',
  //           aggregationType: 'AVERAGE',
  //           resolution: '1m',
  //         },
  //       ],
  //     },
  //   ],
  // };
  const q3: SiteWiseDataStreamQuery = {
    assets: [
      {
        assetId: '934b3a57-8425-4cba-8e35-580a08b592f3',
        properties: [
          {
            propertyId: '1e7f3d8a-a0f6-49e5-a7cb-4920fb955c53',
            aggregationType: 'AVERAGE',
            resolution: '1m',
          },
          {
            propertyId: 'a102500c-cf7a-4856-86fe-b4a3a6962299',
            aggregationType: 'AVERAGE',
            resolution: '1m',
          },
          {
            propertyId: '9c88d966-723c-4eb5-b620-ab249e0f4509',
            aggregationType: 'AVERAGE',
            resolution: '1m',
          },
        ],
      },
    ],
  };

  const qs = [q0, q3];

  return (
    <TimeSync>
      <div id='story-container' style={{ width: '100vw', height: '100vh' }} onClick={() => sn((n + 1) % 2)}>
        <TimeSelection />
        <Chart
          id={id}
          defaultVisualizationType={defaultVisualizationType}
          size={size}
          styleSettings={styleSettings}
          viewport={viewport ?? { duration: '5m' }}
          queries={[getTimeSeriesDataQuery(qs[n])]}
          theme='light'
        />
      </div>
    </TimeSync>
  );
};
