import React from 'react';
import { TimeSelection, TimeSync, useViewport, Chart, KPI } from '../../src';
import {
  getSingleValueTimeSeriesDataQuery,
  getTimeSeriesDataQuery,
  queryConfigured,
} from '../utils/query';
import { ComponentMeta } from '@storybook/react';
import { Gauge } from '../../src/components/gauge/gauge';

export default {
  title: 'Widgets/Default Charts',
  component: Chart,
  argTypes: {
    name: { control: { type: 'text' }, defaultValue: 'Windmill' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Chart>;

export const DefaultCharts = () => {
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

  const Divider = (
    <div
      style={{
        width: '100%',
        height: '5px',
        background: 'grey',
        margin: '20px 0',
      }}
    />
  );

  return (
    <div style={{ padding: '16px' }}>
      <TimeSync>
        <h3>
          This page shows all charts with their default settings (including
          styles, legend settings, sizes, colors)
        </h3>
        <div
          id='story-container'
          style={{ width: '100%', height: 'fit-content' }}
        >
          <TimeSelection />
          <br />
          {Divider}
          <Chart viewport={viewport} queries={[getTimeSeriesDataQuery()]} />
          {Divider}
          <div style={{ width: '350px', height: '200px' }}>
            <KPI
              viewport={viewport}
              query={getSingleValueTimeSeriesDataQuery()}
            />
          </div>
          {Divider}
          <div style={{ width: '350px', height: '350px' }}>
            <Gauge
              viewport={viewport}
              query={getSingleValueTimeSeriesDataQuery()}
            />
          </div>
          {Divider}
        </div>
      </TimeSync>
    </div>
  );
};
