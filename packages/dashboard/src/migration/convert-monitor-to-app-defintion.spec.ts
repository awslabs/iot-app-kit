import {
  DashboardWidgetType,
  MonitorWidgetType,
  type SiteWiseMonitorDashboardDefinition,
} from './types';
import { migrateDashboard } from './convert-monitor-to-app-defintion';
import {
  createMonitorChartWidget,
  metrics,
  createApplicationChartDefinition,
  expectedProperties,
} from './constants';

describe('Dashboard definition conversion', () => {
  it('converts a single SiteWise Monitor line chart into an application line chart', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.LineChart, metrics)],
    };

    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });

    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('converts a single SiteWise Monitor line chart with multiple properties into an application line chart', async () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Other metric',
        assetId: '12345678-85db-4c90-854f-4e29d579b898',
        propertyId: '12345678-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.LineChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                  color: '#7d2105',
                },
              ],
            },
            {
              assetId: '12345678-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: '12345678-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                  color: '#3184c2',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          DashboardWidgetType.XYPlot,
          expectedProperties
        ),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });

    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor bar chart into an application bar chart', async () => {
    const barChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.BarChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      axis: {
        showX: true,
        showY: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
      styleSettings: {}, // refId is randomly generated so we are just asserting that styleSettings exists
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('bar-chart', expectedProperties),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(barChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });

    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor scatter chart into an application scatter chart', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(MonitorWidgetType.ScatterChart, metrics),
      ],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'none',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };
    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor timeline chart into an application timeline chart', async () => {
    const timelineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(MonitorWidgetType.StatusTimeline, metrics),
      ],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
      styleSettings: {}, // refId is randomly generated so we are just asserting that styleSettings exists
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('status-timeline', expectedProperties),
      ],
    };
    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(timelineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor table chart into an application table chart', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.Table, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
      styleSettings: {}, // refId is randomly generated so we are just asserting that styleSettings exists
    };
    const expectedDefinition = {
      widgets: [createApplicationChartDefinition('table', expectedProperties)],
    };
    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor KPI widget into an application KPI', async () => {
    const kpiDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.Kpi, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [createApplicationChartDefinition('kpi', expectedProperties)],
    };
    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(kpiDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a SiteWise Monitor KPI widget with many properties into many application KPIs', async () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const kpiDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.Kpi, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          0,
          0,
          0
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          14,
          0,
          1
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          28,
          0,
          2
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          0,
          8,
          3
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          14,
          8,
          4
        ),
      ],
    };
    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(kpiDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor status grid widget into an application status widget', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(MonitorWidgetType.StatusGrid, metrics),
      ],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [createApplicationChartDefinition('status', expectedProperties)],
    };
    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('converts Monitor annotations into Application thresholds', async () => {
    const color = '#5e87b5';
    const comparisonOperator = 'LT';
    const showValue = true;
    const value = 100;

    const annotations = {
      y: [
        {
          color,
          comparisonOperator,
          showValue,
          value,
        },
      ],
    };

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          annotations
        ),
      ],
    };

    const expectedProperties = {
      title: 'test',
      thresholds: [
        {
          color,
          comparisonOperator,
          value,
          visible: showValue,
        },
      ],
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });
});

describe('Widgets dont overlap after migration', () => {
  it('Widgets that are pushed down are migrated correctly ', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          0,
          0
        ),
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          1,
          2
        ),
      ],
    };

    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          0,
          0,
          0
        ),
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          14,
          24,
          1
        ),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('Widgets that are pushed up are migrated correctly ', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          0,
          5
        ),
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          0,
          3
        ),
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          0,
          6
        ),
      ],
    };

    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          0,
          0,
          0
        ),
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          0,
          24,
          1
        ),
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          0,
          48,
          2
        ),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('Nested overlaps are fixed ', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          0,
          0
        ),
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          1,
          2
        ),
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          2,
          5
        ),
      ],
    };

    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          0,
          0,
          0
        ),
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          14,
          24,
          1
        ),
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          28,
          48,
          2
        ),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('Widgets placed at same point in SWM are migrated correctly ', async () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          0,
          0
        ),
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          2,
          2
        ),
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          undefined,
          undefined,
          2,
          2
        ),
      ],
    };

    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          0,
          0,
          0
        ),
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          28,
          24,
          1
        ),
        createApplicationChartDefinition(
          'xy-plot',
          expectedProperties,
          23.5,
          41.5,
          28,
          48,
          2
        ),
      ],
    };

    const describeDashboard = vi.fn().mockResolvedValue({
      dashboardDefinition: JSON.stringify(lineChartDefinition),
    });

    const applicationDefinition = await migrateDashboard({
      parameters: { dashboardId: 'test-id' },
      iotSiteWiseClient: { describeDashboard: describeDashboard },
    });
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });
});
