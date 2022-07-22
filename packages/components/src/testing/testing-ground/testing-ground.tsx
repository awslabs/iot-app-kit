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
import { Threshold } from '@iot-app-kit/core';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';

const VIEWPORT = { duration: '5m' };

const THREE_MINUTES = 1000 * 60 * 3;

const DEFAULT_RESOLUTION_MAPPING = {
  [THREE_MINUTES]: '1m',
};
const sev1Threshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 55,
  label: {
    text: '1',
    show: true,
  },
  showValue: true,
  color: 'red',
  id: 'red-y-threshold',
  severity: 1,
  audioAlert: { volume: 1.0 },
};

const sev2Threshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 44,
  label: {
    text: '2',
    show: true,
  },
  showValue: true,
  color: 'green',
  id: 'green-y-threshold',
  severity: 2,
  audioAlert: { volume: 1.0 },
};

const sev3Threshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 32,
  label: {
    text: '3',
    show: true,
  },
  showValue: true,
  color: 'blue',
  id: 'blue-y-threshold',
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
      awsRegion: 'us-east-1',
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
              // annotations={{ y: [sev1Threshold] }}
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
              // annotations={{ y: [sev2Threshold] }}
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
              annotations={{ y: [sev3Threshold] }}
              enableAudioAlerts={true}
            />
          </div>
        </div>
        <iot-webgl-context />
      </div>
    );
  }
  // render() {
  //   return (
  //     <div>
  //       <div style={{ width: '600px' }}>
  //         <br />
  //         <br />
  //         <br />
  //         <div style={{ width: '400px', height: '500px' }}>
  //           {/* <iot-scatter-chart
  //             widgetId="scatter-1"
  //             viewport={{ duration: '5m', yMin: 0, yMax: 1 }}
  //             queries={[
  //               this.query.timeSeriesData({
  //                 assets: [
  //                   {
  //                     assetId: DEMO_TURBINE_ASSET_1,
  //                     properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
  //                   },
  //                 ],
  //               }),
  //             ]}
  //           /> */}
  //           <iot-line-chart
  //             widgetId="line-2"
  //             viewport={{ duration: '5m' }}
  //             queries={[
  //               this.query.timeSeriesData({
  //                 assets: [
  //                   {
  //                     assetId: DEMO_TURBINE_ASSET_1,
  //                     properties: [
  //                       { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
  //                       { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
  //                       { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 },
  //                     ],
  //                   },
  //                 ],
  //               }),
  //             ]}
  //             annotations={{ y: [sev1Threshold, sev2Threshold, sev3Threshold] }}
  //             enableAudioAlerts={true}
  //           />
  //           <iot-bar-chart
  //             widgetId="line-2"
  //             viewport={{ duration: '5m' }}
  //             queries={[
  //               this.query.timeSeriesData({
  //                 assets: [
  //                   {
  //                     assetId: DEMO_TURBINE_ASSET_1,
  //                     properties: [
  //                       { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
  //                       { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
  //                       { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 },
  //                     ],
  //                   },
  //                 ],
  //               }),
  //             ]}
  //             annotations={{ y: [sev1Threshold] }}
  //             enableAudioAlerts={true}
  //           />
  //         </div>
  //       </div>
  //       <iot-webgl-context />
  //     </div>
  //   );
  // }
}
