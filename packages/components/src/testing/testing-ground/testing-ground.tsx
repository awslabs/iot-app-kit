import { Component, State, h } from '@stencil/core';
import { ResolutionConfig } from '@iot-app-kit/core';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import {
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
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
    const { query } = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-west-2' });
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
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              widgetId="line-1"
              viewport={{ duration: '5m' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 }],
                    },
                  ],
                }),
              ]}
            />
          </div>
        </div>
        <iot-webgl-context />
      </div>
    );
  }
}
