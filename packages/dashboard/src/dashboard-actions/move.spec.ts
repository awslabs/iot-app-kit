import { DashboardConfiguration } from '../types';
import { getMovedDashboardConfiguration } from './move';
import { MOCK_EMPTY_DASHBOARD, MockWidgetFactory, MockDashboardFactory } from '../testing/mocks';

describe('getMovedDashboardConfiguration', () => {
  it('returns empty dashboard configuration when provided an empty dashboard', () => {
    expect(
      getMovedDashboardConfiguration({
        dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
        cellSize: 5,
        position: { x: 10, y: 10 },
        previousPosition: { x: 9, y: 10 },
        selectedWidgetIds: [],
      })
    ).toEqual(MOCK_EMPTY_DASHBOARD);
  });

  it('shifts a single selected widget by a fractional amount when position changes slightly', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, id: 'some-id' });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    const movedDashboardConfiguration = getMovedDashboardConfiguration({
      dashboardConfiguration,
      cellSize: 10,
      position: { x: 10, y: 10 },
      previousPosition: { x: 9, y: 10 },
      selectedWidgetIds: [lineChartWidget.id],
    });

    const movedLineChartWidget = movedDashboardConfiguration.widgets[0];

    expect(movedLineChartWidget).toEqual({ ...lineChartWidget, x: 1.1, y: 1 });
  });

  it('does not shift off of the grid', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, id: 'some-id' });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    const movedDashboardConfiguration = getMovedDashboardConfiguration({
      dashboardConfiguration,
      cellSize: 10,
      position: { x: 10, y: 10 },
      previousPosition: { x: 10000, y: 10000 },
      selectedWidgetIds: [lineChartWidget.id],
    });

    const movedLineChartWidget = movedDashboardConfiguration.widgets[0];

    expect(movedLineChartWidget).toEqual({ ...lineChartWidget, x: 1, y: 1 });
  });

  it('does not shift widget that is not selected', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, id: 'some-id' });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    const movedDashboardConfiguration = getMovedDashboardConfiguration({
      dashboardConfiguration,
      cellSize: 10,
      position: { x: 10, y: 10 },
      previousPosition: { x: 9, y: 10 },
      selectedWidgetIds: [],
    });

    const unmovedLineChartWidget = movedDashboardConfiguration.widgets[0];

    expect({ ...unmovedLineChartWidget }).toEqual({ ...lineChartWidget });
  });

  it('does not shift widget when previous and current position are the same', () => {
    const lineChartWidget = MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, id: 'some-id' });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [lineChartWidget] });

    const movedDashboardConfiguration = getMovedDashboardConfiguration({
      dashboardConfiguration,
      cellSize: 10,
      position: { x: 10, y: 10 },
      previousPosition: { x: 10, y: 10 },
      selectedWidgetIds: [lineChartWidget.id],
    });

    const unmovedLineChartWidget = movedDashboardConfiguration.widgets[0];

    expect({ ...unmovedLineChartWidget }).toEqual({ ...lineChartWidget });
  });

  it('shifts only selected widgets when multiple widgets are on the dashboard', () => {
    const WIDGET_A = MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, id: 'some-id' });
    const WIDGET_B = MockWidgetFactory.getLineChartWidget({ x: 10, y: 10, z: 1, id: 'some-id-2' });
    const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });

    const movedDashboardConfiguration = getMovedDashboardConfiguration({
      dashboardConfiguration,
      cellSize: 10,
      position: { x: 10, y: 10 },
      previousPosition: { x: 9, y: 9 },
      selectedWidgetIds: [WIDGET_B.id],
    });

    const unmovedWidget = movedDashboardConfiguration.widgets[0];
    const movedWidget = movedDashboardConfiguration.widgets[1];
    expect({ ...unmovedWidget }).toEqual({ ...WIDGET_A });
    expect({ ...movedWidget }).toEqual({ ...WIDGET_B, x: WIDGET_B.x + 0.1, y: WIDGET_B.y + 0.1 });
  });
});
