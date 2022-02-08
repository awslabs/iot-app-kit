import { Component, h } from '@stencil/core';
import { query, initialize, IoTAppKitComponentSession } from '@iot-app-kit/core';
import { DEMO_TURBINE_ASSET_1, DEMO_TURBINE_ASSET_1_PROPERTY_3 } from '../../testing/testing-ground/siteWiseQueries';
import { getEnvCredentials } from '../../testing/testing-ground/getEnvCredentials';

@Component({
  tag: 'testing-ground-demo',
})
export class TestingGround {
  private appKitSession: IoTAppKitComponentSession;

  componentWillLoad() {
    this.appKitSession = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' }).session('id');
  }

  render() {
    return (
      <div style={{ width: '600px', height: '500px' }}>
        <iot-line-chart-demo
          provider={query.iotsitewise
            .timeSeriesData({
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
            })
            .build(this.appKitSession)}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
