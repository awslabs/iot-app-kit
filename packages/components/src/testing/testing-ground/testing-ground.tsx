import { Component, State, h } from '@stencil/core';
import { ResolutionConfig } from '@iot-app-kit/core';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import {
  AGGREGATED_DATA_QUERY,
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_1_PROPERTY_4,
  DEMO_TURBINE_ASSET_2,
  DEMO_TURBINE_ASSET_2_PROPERTY_1,
  DEMO_TURBINE_ASSET_2_PROPERTY_2,
  DEMO_TURBINE_ASSET_2_PROPERTY_3,
  DEMO_TURBINE_ASSET_2_PROPERTY_4,
  DEMO_TURBINE_ASSET_3,
  DEMO_TURBINE_ASSET_3_PROPERTY_1,
  DEMO_TURBINE_ASSET_3_PROPERTY_2,
  DEMO_TURBINE_ASSET_3_PROPERTY_3,
  DEMO_TURBINE_ASSET_3_PROPERTY_4,
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
    const { query } = initialize({
      awsCredentials: getEnvCredentials(),
      awsRegion: 'us-west-2',
      settings: { batchDuration: undefined, legacyAPI: false },
    });
    this.query = query;
  }

  render() {
    return (
      <div>
        <div style={{ width: '600px' }}>
          <br />
          <br />
          <br />
          <div style={{ width: '400px', height: '500px' }}>
            <iot-line-chart
              widgetId="kpi-1"
              viewport={{ duration: '5m' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_2,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_2_PROPERTY_1 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_2,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_2_PROPERTY_2 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_2,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_2_PROPERTY_3 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_2,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_2_PROPERTY_4 }],
                    },
                  ],
                }),
              ]}
            />
            <iot-scatter-chart
              widgetId="kpi-1"
              viewport={{ duration: '5m' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_1 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_2 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_3 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_4 }],
                    },
                  ],
                }),
              ]}
            />
            <iot-kpi
              widgetId="kpi-1"
              viewport={{ duration: '5m' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_1 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_2 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_3 }],
                    },
                    {
                      assetId: DEMO_TURBINE_ASSET_3,
                      properties: [{ propertyId: DEMO_TURBINE_ASSET_3_PROPERTY_4 }],
                    },
                  ],
                }),
              ]}
            />
            <iot-dial
              widgetId="dial-1"
              viewport={{ duration: 1000, yMin: 0, yMax: 2110 }}
              size="L"
              significantDigits={2}
              queries={[this.query.timeSeriesData(AGGREGATED_DATA_QUERY)]}
            />
          </div>
        </div>
        <iot-webgl-context />
      </div>
    );
  }
}
