import { Component, State, h } from '@stencil/core';
import { ResolutionConfig } from '@iot-app-kit/core';
import { initialize, SiteWiseQuery, toId } from '@iot-app-kit/source-iotsitewise';
import {
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_2,
  DEMO_TURBINE_ASSET_3,
  UNFOUNDED_PROPERTY,
} from './siteWiseQueries';
import { getEnvCredentials } from './getEnvCredentials';
import { Item, TableProps } from '@iot-app-kit/table';
import { Annotations, COMPARISON_OPERATOR, StatusIcon } from '@synchro-charts/core';

const VIEWPORT = { duration: '5m' };

const THREE_MINUTES = 1000 * 60 * 3;

const DEFAULT_RESOLUTION_MAPPING = {
  [THREE_MINUTES]: '1m',
};

const items: Item[] = [
  {
    rpm: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_1, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }),
        resolution: 0,
      },
    },
    avg_wind_speed: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_1, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }),
        resolution: 0,
      },
    },
    torque: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_1, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }),
        resolution: 0,
      },
    },
    myLabel: 'Iot',
  },
  {
    rpm: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_2, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }),
        resolution: 0,
      },
    },
    avg_wind_speed: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_2, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }),
        resolution: 0,
      },
    },
    torque: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_2, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }),
        resolution: 0,
      },
    },
    myLabel: 'App',
  },
  {
    rpm: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_3, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }),
        resolution: 0,
      },
    },
    avg_wind_speed: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_3, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }),
        resolution: 0,
      },
    },
    torque: {
      $cellRef: {
        id: toId({ assetId: DEMO_TURBINE_ASSET_3, propertyId: UNFOUNDED_PROPERTY }),
        resolution: 0,
      },
    },
    // missing myLabel property
  },
  // a pure hard coded object.
  {
    rpm: 28.910800000000002,
    avg_wind_speed: 30,
    torque: 25,
    myLabel: 'Kit',
  },
];

const columnDefinitions: TableProps['columnDefinitions'] = [
  {
    key: 'rpm',
    header: 'RPM',
  },
  {
    key: 'avg_wind_speed',
    header: 'Average wind speed',
    sortingField: 'avg_wind_speed',
  },
  {
    key: 'torque',
    header: 'Torque (Newton Meter)',
    formatter: (data) => `${Math.round((data as number) * 100) / 100} kN/M`,
    sortingField: 'torque',
    maxWidth: 200,
  },
  {
    key: 'myLabel',
    header: 'Customized Label',
  },
];

const annotations: Annotations = {
  y: [
    {
      color: 'red',
      value: 30,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      icon: StatusIcon.ERROR,
      dataStreamIds: [toId({ assetId: DEMO_TURBINE_ASSET_2, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 })],
    },

    {
      color: 'green',
      value: 27,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      icon: StatusIcon.NORMAL,
      dataStreamIds: [
        toId({ assetId: DEMO_TURBINE_ASSET_1, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }),
        toId({ assetId: DEMO_TURBINE_ASSET_2, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }),
        toId({ assetId: DEMO_TURBINE_ASSET_3, propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }),
      ],
    },
  ],
};

const propertyFiltering: TableProps['propertyFiltering'] = {
  noMatch: 'No Match',
  filteringProperties: [
    {
      key: 'rpm',
      groupValuesLabel: 'Rotation Per Minute',
      propertyLabel: 'RPM',
      operators: ['<', '<=', '>', '>=', ':', '!:', '=', '!='],
    },
    {
      key: 'myLabel',
      groupValuesLabel: 'Label',
      propertyLabel: 'Label',
    },
    {
      key: 'torque',
      groupValuesLabel: 'Torque',
      propertyLabel: 'Torque',
      operators: ['<', '<=', '>', '>=', ':', '!:', '=', '!='],
    },
  ],
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
        <div style={{ width: '800px' }}>
          <iot-table
            viewport={this.viewport}
            items={items}
            columnDefinitions={columnDefinitions}
            propertyFiltering={propertyFiltering}
            annotations={annotations}
            queries={[
              this.query.timeSeriesData({
                assets: [
                  {
                    assetId: DEMO_TURBINE_ASSET_1,
                    properties: [
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 },
                    ],
                  },
                  {
                    assetId: DEMO_TURBINE_ASSET_2,
                    properties: [
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 },
                    ],
                  },
                  {
                    assetId: DEMO_TURBINE_ASSET_3,
                    properties: [
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
                      { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
                      { propertyId: UNFOUNDED_PROPERTY },
                    ],
                  },
                ],
              }),
            ]}
          />
          <br />
          <br />
          <br />
          <div style={{ width: '400px', height: '500px' }}>
            <iot-scatter-chart
              widgetId="scatter-1"
              viewport={{ duration: '5m', yMin: 0, yMax: 1 }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
                    },
                  ],
                }),
              ]}
            />
            <iot-line-chart
              widgetId="line-2"
              viewport={{ duration: '5m' }}
              queries={[
                this.query.timeSeriesData({
                  assets: [
                    {
                      assetId: DEMO_TURBINE_ASSET_1,
                      properties: [
                        { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
                        { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
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
