import { MockDashboardFactory, MockWidgetFactory, MOCK_EMPTY_DASHBOARD } from '../../testing/mocks';
import { getSelectedWidgetIds } from './select';

describe('getSelectedIds', () => {
  it('returns no ids when dashboard has no widgets', () => {
    expect(
      getSelectedWidgetIds({
        dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
        cellSize: 10,
        selectedRect: { x: 0, y: 0, width: 1000, height: 1000 },
      })
    ).toEqual([]);
  });

  it('returns id of widget that is contained within the selected rectangle', () => {
    expect(
      getSelectedWidgetIds({
        dashboardConfiguration: MockDashboardFactory.get({
          widgets: [MockWidgetFactory.getLineChartWidget({ x: 5, y: 5, width: 1, height: 1, id: 'some-id' })],
        }),
        cellSize: 10,
        selectedRect: { x: 0, y: 0, width: 100, height: 100 },
      })
    ).toEqual(['some-id']);
  });

  it('returns id of widget that overlaps the selected rectangle', () => {
    expect(
      getSelectedWidgetIds({
        dashboardConfiguration: MockDashboardFactory.get({
          widgets: [MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, width: 1, height: 1, id: 'some-id' })],
        }),
        cellSize: 10,
        selectedRect: { x: 10, y: 10, width: 10, height: 10 },
      })
    ).toEqual(['some-id']);
  });

  it('returns no ids when the widgets are not overlapping the selected rectangle', () => {
    expect(
      getSelectedWidgetIds({
        dashboardConfiguration: MockDashboardFactory.get({
          widgets: [MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, width: 1, height: 1, id: 'some-id' })],
        }),
        cellSize: 5,
        selectedRect: { x: 10, y: 10, width: 10, height: 10 },
      })
    ).toEqual([]);
  });

  it('returns only ids of overlapping widgets when multiple widgets provided', () => {
    expect(
      getSelectedWidgetIds({
        dashboardConfiguration: MockDashboardFactory.get({
          widgets: [
            MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, width: 1, height: 1, id: 'some-id' }),
            MockWidgetFactory.getLineChartWidget({ x: 50, y: 50, width: 1, height: 1, id: 'some-id-2' }),
          ],
        }),
        cellSize: 10,
        selectedRect: { x: 10, y: 10, width: 10, height: 10 },
      })
    ).toEqual(['some-id']);
  });
});
