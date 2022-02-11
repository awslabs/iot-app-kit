import { Component, State, h } from '@stencil/core';
import { initialize, ResolutionConfig, IoTAppKit, query } from '@iot-app-kit/core';
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
  private appKit: IoTAppKit;

  componentWillLoad() {
    this.appKit = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' });
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
            appKit={this.appKit}
            query={query.iotsitewise.timeSeriesData({
              queries: [
                {
                  source: 'site-wise',
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
                },
              ],
              request: {
                viewport: VIEWPORT,
              },
            })}
          />
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              appKit={this.appKit}
              query={query.iotsitewise.timeSeriesData({
                queries: [
                  {
                    source: 'site-wise',
                    assets: [
                      {
                        assetId: DEMO_TURBINE_ASSET_1,
                        properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
                      },
                    ],
                  },
                  {
                    source: 'site-wise',
                    assets: [
                      {
                        assetId: DEMO_TURBINE_ASSET_1,
                        properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
                      },
                    ],
                  },
                ],
                request: {
                  viewport: { duration: '5m', group: 'in-sync' },
                },
              })}
            />
          </div>
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              appKit={this.appKit}
              query={query.iotsitewise.timeSeriesData({
                queries: [
                  {
                    source: 'site-wise',
                    assets: [
                      {
                        assetId: DEMO_TURBINE_ASSET_1,
                        properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }],
                      },
                    ],
                  },
                ],
                request: {
                  viewport: { duration: '5m', group: 'in-sync' },
                },
              })}
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
            appKit={this.appKit}
            query={query.iotsitewise.timeSeriesData({
              queries: [AGGREGATED_DATA_QUERY],
              request: {
                settings: {
                  resolution: this.resolution,
                  requestBuffer: 1,
                },
                viewport: this.viewport,
              },
            })}
          />
        </div>
        <iot-asset-details query={ASSET_DETAILS_QUERY} />
        <sc-webgl-context />
      </div>
    );
  }
}
