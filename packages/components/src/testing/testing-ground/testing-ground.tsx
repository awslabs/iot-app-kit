import { Component, h } from '@stencil/core';
import { initialize, DataModule } from '@iot-app-kit/core';
import {
  ASSET_DETAILS_QUERY,
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_1_PROPERTY_4,
  AGGREGATED_DATA_QUERY,
} from './siteWiseQueries';
import { getEnvCredentials } from './getEnvCredentials';

const VIEWPORT = { duration: '5m' };

const THREE_MINUTES = 1000 * 60 * 3;

const resolutionMapping = {
  [THREE_MINUTES]: '1m',
}

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  private dataModule: DataModule;

  componentWillLoad() {
    this.dataModule = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-west-2' });
  }

  render() {
    return (
      <div>
        <div style={{ width: '600px' }}>
          <br />
          <br />
          <br />
          <iot-kpi
            appKit={this.dataModule}
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
              appKit={this.dataModule}
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
              appKit={this.dataModule}
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
        <div style={{ width: '400px', height: '500px' }}>
          <iot-line-chart
            appKit={
              initialize({
                awsCredentials: getEnvCredentials(),
                awsRegion: 'us-east-1'
            })}
            query={AGGREGATED_DATA_QUERY}
            viewport={VIEWPORT}
            requestConfig={{ resolutionMapping, fetchAggregatedData: true }}
          />
        </div>
        <iot-asset-details query={ASSET_DETAILS_QUERY} />
        <sc-webgl-context />
      </div>
    );
  }
}
