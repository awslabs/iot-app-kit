import { Component, State, h } from '@stencil/core';
import { ResolutionConfig } from '@iot-app-kit/core';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import {
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
import { COMPARISON_OPERATOR } from '@synchro-charts/core';

const VIEWPORT = { duration: '5m' };

const THREE_MINUTES = 1000 * 60 * 3;

const DEFAULT_RESOLUTION_MAPPING = {
  [THREE_MINUTES]: '1m',
};

const THRESHOLD1 = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 6,
  label: {
    text: '1',
    show: true,
  },
  showValue: true,
  color: 'red',
  severity: 1,
  audioAlert: { volume: 1.0 },
};

const THRESHOLD2 = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 6,
  label: {
    text: '1',
    show: true,
  },
  showValue: true,
  color: 'green',
  severity: 2,
  audioAlert: { volume: 1.0 },
};

const THRESHOLD3 = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 6,
  label: {
    text: '1',
    show: true,
  },
  showValue: true,
  color: 'blue',
  severity: 3,
  audioAlert: { volume: 1.0 },
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
              annotations={{ y: [THRESHOLD1] }}
              enableAudioAlerts={true}
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
              annotations={{ y: [THRESHOLD2] }}
              enableAudioAlerts={true}
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
              annotations={{ y: [THRESHOLD3] }}
              enableAudioAlerts={true}
            />
          </div>
        </div>
        <iot-webgl-context />
      </div>
    );
  }
}
