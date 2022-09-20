import { Component, State, h } from '@stencil/core';
import { ResolutionConfig } from '@iot-app-kit/core';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { DEMO_ASSET, DEMO_PROPERTY, DEMO_ALARM_PROPERTY } from './siteWiseQueries';
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
    const { query } = initialize({
      awsCredentials: getEnvCredentials(),
      awsRegion: 'us-east-1',
      settings: { batchDuration: undefined, legacyAPI: false },
    });
    this.query = query;
  }

  render() {
    return (
      <div>
        <div style={{ width: '800px' }}>
          <div style={{ width: '400px', height: '500px' }}>
            <iot-status-grid
              widgetId="status-grid"
              viewport={{ duration: '10m' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_ASSET,
                      properties: [{ propertyId: DEMO_ALARM_PROPERTY }],
                    },
                  ],
                }),
              ]}
            />
            <div style={{ height: '200px' }}>
              <iot-status-timeline
                widgetId="status-timeline"
                viewport={{ duration: '10m' }}
                queries={[
                  this.query.timeSeriesData({
                    assets: [
                      {
                        assetId: DEMO_ASSET,
                        properties: [{ propertyId: DEMO_ALARM_PROPERTY }],
                      },
                    ],
                  }),
                ]}
              />
            </div>
            <iot-line-chart
              widgetId="line-chart"
              viewport={{ duration: '10m' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_ASSET,
                      properties: [
                        {
                          propertyId: DEMO_PROPERTY,
                        },
                        {
                          propertyId: DEMO_ALARM_PROPERTY,
                        },
                      ],
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
