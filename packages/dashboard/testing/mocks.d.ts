/**
 * Shared mocks for testing purposes
 */
import { DashboardConfiguration, Widget } from '../src/types';
export declare const createMockWidget: (baseWidget: Widget) => (partialWidget?: Partial<Widget>) => Widget;
export declare const MOCK_KPI_WIDGET: Widget;
export declare const MOCK_SCATTER_CHART_WIDGET: Widget;
export declare const MOCK_LINE_CHART_WIDGET: Widget;
export declare const MockWidgetFactory: {
  getKpiWidget: (partialWidget?: Partial<Widget>) => Widget;
  getScatterChartWidget: (partialWidget?: Partial<Widget>) => Widget;
  getLineChartWidget: (partialWidget?: Partial<Widget>) => Widget;
};
export declare const MOCK_EMPTY_DASHBOARD: DashboardConfiguration;
export declare const createMockDashboard: (
  partialDashboard?: Partial<DashboardConfiguration>
) => DashboardConfiguration;
export declare const MockDashboardFactory: {
  get: (partialDashboard?: Partial<DashboardConfiguration>) => DashboardConfiguration;
};
export declare const dashboardConfig: DashboardConfiguration;
