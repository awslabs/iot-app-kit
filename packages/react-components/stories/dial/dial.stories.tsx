import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Dial } from '../../src/components/dial/dial';
import { initialize } from '@iot-app-kit/source-iotsitewise';

const ASSET_ID = '587295b6-e0d0-4862-b7db-b905afd7c514';
const PROPERTY_ID = '16d45cb7-bb8b-4a1e-8256-55276f261d93';

export default {
  title: 'Widgets/Dial/Dial',
  component: Dial,
  argTypes: {
    yMin: { control: { type: 'number' }, defaultValue: 0 },
    yMax: { control: { type: 'number' }, defaultValue: 100 },
    assetId: { control: { type: 'string' }, defaultValue: ASSET_ID },
    propertyId: { control: { type: 'string' }, defaultValue: PROPERTY_ID },
    accessKeyId: { control: { type: 'string' } },
    secretAccessKey: { control: { type: 'string' } },
    sessionToken: { control: { type: 'string' } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dial>;

const { query } = initialize({
  awsCredentials: {
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
    sessionToken: 'xxxx',
  },
});

export const Main: ComponentStory<typeof Dial> = () => (
  <div style={{ width: '200px', height: '200px' }}>
    <Dial
      viewport={{ duration: '5m' }}
      settings={{
        yMin: 0,
        yMax: 100,
      }}
      query={query.timeSeriesData({
        assets: [
          {
            assetId: ASSET_ID,
            properties: [
              {
                propertyId: PROPERTY_ID,
              },
            ],
          },
        ],
      })}
    />
  </div>
);
