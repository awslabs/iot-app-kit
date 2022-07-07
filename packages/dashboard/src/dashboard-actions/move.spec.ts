import { getMovedDashboardConfiguration } from './move';

describe('getMovedDashboardConfiguration', () => {
  it('returns empty dashboard configuration when provided an empty dashboard', () => {
    expect(
      getMovedDashboardConfiguration({
        dashboardConfiguration: [],
        cellSize: 5,
        position: { x: 10, y: 10 },
        previousPosition: { x: 9, y: 10 },
        selectedWidgetIds: [],
      })
    ).toEqual([]);
  });

  it('shifts a single selected widget by a fractional amount when position changes slightly', () => {
    expect(
      getMovedDashboardConfiguration({
        dashboardConfiguration: [{ x: 1, y: 1, z: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }],
        cellSize: 10,
        position: { x: 10, y: 10 },
        previousPosition: { x: 9, y: 10 },
        selectedWidgetIds: ['some-id'],
      })
    ).toEqual([{ x: 1.1, y: 1, z: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }]);
  });

  it('does not shift off of the grid', () => {
    expect(
      getMovedDashboardConfiguration({
        dashboardConfiguration: [{ x: 1, y: 1, z: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }],
        cellSize: 10,
        position: { x: 10, y: 10 },
        previousPosition: { x: 10000, y: 10000 },
        selectedWidgetIds: ['some-id'],
      })
    ).toEqual([{ x: 1, y: 1, z: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }]);
  });

  it('does not shift widget that is not selected', () => {
    const WIDGET = { x: 1, y: 1, z: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' };
    expect(
      getMovedDashboardConfiguration({
        dashboardConfiguration: [WIDGET],
        cellSize: 10,
        position: { x: 10, y: 10 },
        previousPosition: { x: 9, y: 10 },
        selectedWidgetIds: [],
      })
    ).toEqual([WIDGET]);
  });

  it('does not shift widget when previous and current position are the same', () => {
    const WIDGET = { x: 1, y: 1, z: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' };
    expect(
      getMovedDashboardConfiguration({
        dashboardConfiguration: [WIDGET],
        cellSize: 10,
        position: { x: 10, y: 10 },
        previousPosition: { x: 10, y: 10 },
        selectedWidgetIds: [],
      })
    ).toEqual([WIDGET]);
  });

  it('shifts only selected widgets when multiple widgets are on the dashboard', () => {
    const WIDGET_A = { x: 1, y: 1, z: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' };
    const WIDGET_B = { x: 10, y: 10, z: 1, width: 1, height: 1, id: 'some-id-2', widget: 'line-chart' };
    expect(
      getMovedDashboardConfiguration({
        dashboardConfiguration: [WIDGET_A, WIDGET_B],
        cellSize: 10,
        position: { x: 10, y: 10 },
        previousPosition: { x: 9, y: 9 },
        selectedWidgetIds: [WIDGET_B.id],
      })
    ).toEqual([WIDGET_A, { ...WIDGET_B, x: WIDGET_B.x + 0.1, y: WIDGET_B.y + 0.1 }]);
  });
});
