import { Component, h } from '@stencil/core';
import { query } from '@iot-app-kit/core';
import { DEMO_TURBINE_ASSET_1, DEMO_TURBINE_ASSET_1_PROPERTY_3 } from './siteWiseQueries';

@Component({
  tag: 'new-testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  render() {
    return (
      <div style={{ width: '600px', height: '500px' }}>
        <iot-line-chart-demo
          appKit={{
            session: (widgetId: string) => ({
              componentId: widgetId,
              attachDataModuleSession: () => ({}),
              getSessionMetrics: () => ({}),
            }),
          }}
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
            ],
            request: {
              settings: {
                fetchMostRecentBeforeStart: true,
              },
              viewport: { duration: '5m' },
            },
          })}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
