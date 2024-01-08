import { MockWidgetFactory } from '../../testing/mocks';
import { getSelectedWidgetIds, pointSelect, selectedRect } from './select';

describe('getSelectedIds', () => {
  it('returns no ids when dashboard has no widgets', () => {
    expect(
      getSelectedWidgetIds({
        dashboardWidgets: [],
        cellSize: 10,
        selectedRect: { x: 0, y: 0, width: 1000, height: 1000 },
      })
    ).toEqual([]);
  });

  it('returns id of widget that is contained within the selected rectangle', () => {
    expect(
      getSelectedWidgetIds({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 5,
            y: 5,
            width: 1,
            height: 1,
            id: 'some-id',
          }),
        ],
        cellSize: 10,
        selectedRect: { x: 0, y: 0, width: 100, height: 100 },
      })
    ).toEqual(['some-id']);
  });

  it('returns id of widget that overlaps the selected rectangle', () => {
    expect(
      getSelectedWidgetIds({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 1,
            y: 1,
            width: 1,
            height: 1,
            id: 'some-id',
          }),
        ],
        cellSize: 10,
        selectedRect: { x: 10, y: 10, width: 10, height: 10 },
      })
    ).toEqual(['some-id']);
  });

  it('returns no ids when the widgets are not overlapping the selected rectangle', () => {
    expect(
      getSelectedWidgetIds({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            id: 'some-id',
          }),
        ],
        cellSize: 5,
        selectedRect: { x: 10, y: 10, width: 10, height: 10 },
      })
    ).toEqual([]);
  });

  it('returns only ids of overlapping widgets when multiple widgets provided', () => {
    expect(
      getSelectedWidgetIds({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 1,
            y: 1,
            width: 1,
            height: 1,
            id: 'some-id',
          }),
          MockWidgetFactory.getLineChartWidget({
            x: 50,
            y: 50,
            width: 1,
            height: 1,
            id: 'some-id-2',
          }),
        ],
        cellSize: 10,
        selectedRect: { x: 10, y: 10, width: 10, height: 10 },
      })
    ).toEqual(['some-id']);
  });
});

describe('pointSelect', () => {
  it('returns undefined if point is not contained within a widget bounds', () => {
    expect(
      pointSelect({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 10,
            y: 10,
            width: 1,
            height: 1,
            id: 'some-id',
          }),
          MockWidgetFactory.getLineChartWidget({
            x: 50,
            y: 50,
            width: 1,
            height: 1,
            id: 'some-id-2',
          }),
        ],
        cellSize: 10,
        position: { x: 0, y: 0 },
      })
    ).toBeUndefined();
  });

  it('returns the a widget if the point is contained within its bounds', () => {
    expect(
      pointSelect({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 1,
            y: 1,
            width: 1,
            height: 1,
            id: 'some-id',
          }),
          MockWidgetFactory.getLineChartWidget({
            x: 50,
            y: 50,
            width: 1,
            height: 1,
            id: 'some-id-2',
          }),
        ],
        cellSize: 10,
        position: { x: 15, y: 15 },
      })
    ).toEqual(expect.objectContaining({ id: 'some-id' }));

    expect(
      pointSelect({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 1,
            y: 1,
            width: 1,
            height: 1,
            id: 'some-id',
          }),
          MockWidgetFactory.getLineChartWidget({
            x: 50,
            y: 50,
            width: 1,
            height: 1,
            id: 'some-id-2',
          }),
        ],
        cellSize: 10,
        position: { x: 505, y: 505 },
      })
    ).toEqual(expect.objectContaining({ id: 'some-id-2' }));
  });

  it('returns the top most widget if point is contained within 2 overlapping widgets', () => {
    expect(
      pointSelect({
        dashboardWidgets: [
          MockWidgetFactory.getLineChartWidget({
            x: 1,
            y: 1,
            width: 1,
            height: 1,
            z: 0,
            id: 'some-id',
          }),
          MockWidgetFactory.getLineChartWidget({
            x: 1,
            y: 1,
            width: 1,
            height: 1,
            z: 1,
            id: 'some-id-2',
          }),
        ],
        cellSize: 10,
        position: { x: 15, y: 15 },
      })
    ).toEqual(expect.objectContaining({ id: 'some-id-2' }));
  });
});

describe('selectedRect', () => {
  it('returns the selection bounds for 2 points', () => {
    expect(
      selectedRect({
        start: { x: 0, y: 0 },
        end: { x: 10, y: 10 },
      })
    ).toEqual({ x: 0, y: 0, width: 10, height: 10 });

    expect(
      selectedRect({
        start: { x: 10, y: 10 },
        end: { x: 10, y: 10 },
      })
    ).toEqual({ x: 10, y: 10, width: 0, height: 0 });

    expect(
      selectedRect({
        start: { x: -10, y: -10 },
        end: { x: 10, y: 10 },
      })
    ).toEqual({ x: -10, y: -10, width: 20, height: 20 });
  });

  it('returns undefined if the points are undefined', () => {
    expect(selectedRect(undefined)).toBeUndefined();
  });
});
