import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { KPI } from '../../src/components/kpi/kpi';
import {
  getSingleValueTimeSeriesDataQuery,
  queryConfigured,
} from '../utils/query';
import {
  MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY,
  MOCK_TIME_SERIES_DATA_QUERY,
} from './mock-data';

const ASSET_ID = '587295b6-e0d0-4862-b7db-b905afd7c514';
const PROPERTY_ID = '16d45cb7-bb8b-4a1e-8256-55276f261d93';

export default {
  title: 'Widgets/KPI/KPI',
  component: KPI,
  argTypes: {
    assetId: { control: { type: 'string' }, defaultValue: ASSET_ID },
    propertyId: { control: { type: 'string' }, defaultValue: PROPERTY_ID },
    accessKeyId: { control: { type: 'string' } },
    secretAccessKey: { control: { type: 'string' } },
    sessionToken: { control: { type: 'string' } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KPI>;

export const MockDataKPI: ComponentStory<typeof KPI> = () => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          thresholds={[
            {
              value: 435,
              id: 'abc',
              color: '#be1c1f',
              comparisonOperator: 'GT',
            },
          ]}
          viewport={{ duration: '5m' }}
          query={MOCK_TIME_SERIES_DATA_QUERY}
        />
      </div>
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          thresholds={[
            {
              value: 35,
              id: '123',
              color: '#dfe7f5',
              comparisonOperator: 'GT',
            },
          ]}
          viewport={{ duration: '5m' }}
          query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        />
      </div>
    </div>
  );
};

export const ConnectedKPIWidget: ComponentStory<typeof KPI> = () => {
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
    <div style={{ background: 'grey' }}>
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          viewport={{ duration: '5m' }}
          query={getSingleValueTimeSeriesDataQuery()}
        />
      </div>
    </div>
  );
};
