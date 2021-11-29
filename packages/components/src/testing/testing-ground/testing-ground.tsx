import { Component, h } from '@stencil/core';
import { initialize } from '@iot-app-kit/core';
import {
  ASSET_DETAILS_QUERY,
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_1_PROPERTY_4,
} from './siteWiseQueries';
import { getEnvCredentials } from './getEnvCredentials';

const VIEWPORT = { duration: '5m' };

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  componentWillLoad() {
    initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-west-2' });
  }

  render() {
    return (
      <div>
        <div style={{ width: '600px' }}>
          <br />
          <br />
          <br />
          <iot-kpi
            query={{
              source: 'site-wise',
              assets: [
                {
                  assetId: DEMO_TURBINE_ASSET_1,
                  propertyIds: [
                    DEMO_TURBINE_ASSET_1_PROPERTY_1,
                    DEMO_TURBINE_ASSET_1_PROPERTY_2,
                    DEMO_TURBINE_ASSET_1_PROPERTY_3,
                    DEMO_TURBINE_ASSET_1_PROPERTY_4,
                  ],
                },
              ],
            }}
            viewport={VIEWPORT}
          />
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              query={{
                source: 'site-wise',
                assets: [
                  {
                    assetId: DEMO_TURBINE_ASSET_1,
                    propertyIds: [DEMO_TURBINE_ASSET_1_PROPERTY_3],
                  },
                ],
              }}
              viewport={{ duration: '5m', group: 'in-sync' }}
            />
          </div>
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              query={{
                source: 'site-wise',
                assets: [
                  {
                    assetId: DEMO_TURBINE_ASSET_1,
                    propertyIds: [DEMO_TURBINE_ASSET_1_PROPERTY_2],
                  },
                ],
              }}
              viewport={{ duration: '5m', group: 'in-sync' }}
            />
          </div>
        </div>
        <iot-asset-details query={ASSET_DETAILS_QUERY} />
        <sc-webgl-context />
      </div>
    );
  }
}
