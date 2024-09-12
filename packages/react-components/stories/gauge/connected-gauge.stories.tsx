// eslint-disable-next-line import/default
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { getTimeSeriesDataQuery, queryConfigured } from '../utils/query';
import { useViewport } from '../../src';
import { Gauge } from '../../src/components/gauge/gauge';

const ASSET_ID = 'efd79acf-bbf4-4528-936a-a79cda837c59';
const PROPERTY_ID = '118fdb82-8739-426b-bda5-9147915a5165';

export default {
  title: 'Widgets/Gauge',
  component: Gauge,
  argTypes: {
    settings: {
      control: { type: 'object' },
      defaultValue: {
        gaugeThickness: 30,
        showName: true,
        showUnit: true,
        fontSize: 40,
        labelFontSize: 16,
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

//TODO: Getting the data from token not working
export const ConnectedGuage: ComponentStory<typeof Gauge> = ({ settings }) => {
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
    <div style={{ height: '500px', width: '500px', padding: '20px' }}>
      <Gauge
        viewport={viewport}
        query={getTimeSeriesDataQuery()}
        settings={settings}
        titleText='Average Speed'
      />
    </div>
  );
};
