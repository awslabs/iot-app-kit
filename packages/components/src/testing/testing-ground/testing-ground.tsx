import { Component, State, h } from '@stencil/core';
import { ResolutionConfig } from '@iot-app-kit/core';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import {
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

const DEFAULT_RESOLUTION_MAPPING = {
  [THREE_MINUTES]: '1m',
};

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  @State() resolution: ResolutionConfig = DEFAULT_RESOLUTION_MAPPING;
  @State() viewport: { duration: string } = VIEWPORT;
  private query: SiteWiseQuery;

  componentWillLoad() {
    const { query } = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' });
    this.query = query;
  }

  private changeResolution = (ev: Event) => {
    const resolution = (ev.target as HTMLSelectElement)?.value;

    if (resolution === 'auto') {
      this.resolution = DEFAULT_RESOLUTION_MAPPING;
    } else if (resolution === '0') {
      this.resolution = {};
    } else {
      this.resolution = resolution;
    }
  };

  private changeDuration = (ev: Event) => {
    const duration = `${(ev.target as HTMLSelectElement)?.value}m`;

    this.viewport = { duration };
  };

  render() {
    return (
      <div>
        <div style={{ width: '600px' }}>
          <br />
          <br />
          <br />
          <iot-kpi
            viewport={VIEWPORT}
            queries={[
              this.query.timeSeriesData({
                assets: [
                  {
                    assetId: DEMO_TURBINE_ASSET_1,
                    properties: [
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 },
                    ],
                  },
                ],
              }),
            ]}
          />
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              viewport={{ duration: '5m', group: 'in-sync' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
                    },
                  ],
                }),
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
                    },
                  ],
                }),
              ]}
            />
          </div>
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              viewport={{ duration: '5m', group: 'in-sync' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }],
                    },
                  ],
                }),
              ]}
            />
          </div>
        </div>
        resolution:{' '}
        <select onChange={this.changeResolution}>
          <option value={'0'}>raw</option>
          <option value={'1m'}>1m</option>
          <option selected value={'auto'}>
            auto
          </option>
        </select>
        viewport:{' '}
        <select onChange={this.changeDuration}>
          <option value={'1'}>1 minute</option>
          <option value={'3'}>3 minutes</option>
          <option selected value={'5'}>
            5 minutes
          </option>
          <option value={'30'}>30 minutes</option>
        </select>
        <div style={{ width: '400px', height: '500px' }}>
          <iot-line-chart
            viewport={this.viewport}
            settings={{ resolution: this.resolution, requestBuffer: 1 }}
            styleSettings={{ ['testing']: { color: '#FF0000' } }}
            queries={[this.query.timeSeriesData(AGGREGATED_DATA_QUERY)]}
          />
        </div>
        <iot-webgl-context />
      </div>
    );
  }
}
