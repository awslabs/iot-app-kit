import { type Meta } from '@storybook/react';
import { KPI } from '../../src/components/kpi/kpi';
import {
  getSingleValueAlarmDataQuery,
  getSingleValueTimeSeriesDataQuery,
  queryConfigured,
} from '../utils/query';

export default {
  title: 'Widgets/KPI',
  component: KPI,
  argTypes: {
    assetId: { control: { type: 'string' } },
    propertyId: { control: { type: 'string' } },
    accessKeyId: { control: { type: 'string' } },
    secretAccessKey: { control: { type: 'string' } },
    sessionToken: { control: { type: 'string' } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof KPI>;

export const ConnectedKPIWidget = () => {
  const hasAlarmIds = import.meta.env.VITE_ALARM_COMPOSITE_MODEL_ID_1 !== null;

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
      {hasAlarmIds && (
        <div style={{ height: '200px', width: '250px', padding: '20px' }}>
          <KPI
            viewport={{ duration: '5m' }}
            query={getSingleValueAlarmDataQuery()}
          />
        </div>
      )}
    </div>
  );
};
