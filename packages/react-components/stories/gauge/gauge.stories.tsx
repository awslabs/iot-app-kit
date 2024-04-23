// eslint-disable-next-line import/default
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
  MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY,
  MOCK_TIME_SERIES_DATA_QUERY,
} from './mock-data';
import { getTimeSeriesDataQuery, queryConfigured } from '../utils/query';
import { useViewport } from '../../src';
import { Gauge } from '../../src/components/gauge/gauge';

const ASSET_ID = 'efd79acf-bbf4-4528-936a-a79cda837c59';
const PROPERTY_ID = '118fdb82-8739-426b-bda5-9147915a5165';

export default {
  title: 'Widgets/Gauge/Gauge',
  component: Gauge,
  argTypes: {
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
    assetId: { control: { type: 'string' }, defaultValue: ASSET_ID },
    propertyId: { control: { type: 'string' }, defaultValue: PROPERTY_ID },
    accessKeyId: { control: { type: 'string' } },
    secretAccessKey: { control: { type: 'string' } },
    sessionToken: { control: { type: 'string' } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Gauge>;

export const MockDataGauge: ComponentStory<typeof Gauge> = ({ settings }) => (
  <div
    style={{
      width: '1500px',
      height: '500px',
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
    }}
  >
    <Gauge
      thresholds={[]}
      viewport={{ duration: '5m' }}
      query={MOCK_TIME_SERIES_DATA_QUERY}
      settings={settings}
    />
    <Gauge
      thresholds={[
        {
          value: 30,
          id: 'abc',
          color: '#1e8103',
          comparisonOperator: 'GT',
        },
        {
          value: 70,
          id: 'xyz',
          color: '#ed7211',
          comparisonOperator: 'GT',
        },
        {
          value: 100,
          id: 'xyz',
          color: '#d13211',
          comparisonOperator: 'GT',
        },
      ]}
      viewport={{ duration: '5m' }}
      query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
      settings={settings}
    />
  </div>
);

//TODO: Getting the data from token not working
export const ConnectedGuageWidget: ComponentStory<typeof Gauge> = ({
  settings,
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

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '20px',
      }}
    >
      <Gauge
        viewport={viewport}
        query={getTimeSeriesDataQuery()}
        settings={settings}
      />
    </div>
  );
};
