import { MockDashboardFactory, MockWidgetFactory, MOCK_EMPTY_DASHBOARD } from '../testing/mocks';
import { applyReverseAction, reverseAction } from './reverseAction';
//broken into sections based on reverse actions and applying reversals.
//broken into sub sections based on move or resize
describe('reverseActions - MOVE', () => {
  it('returns move action where position and prevPosition are switched', () => {
    expect(
      reverseAction({
        type: 'MOVE',
        payload: {
          position: { x: 10, y: 10 },
          prevPosition: { x: 11, y: 10 },
          widgetIds: ['some-id'],
          cellSize: 10,
        },
      })
    ).toEqual({
      payload: { cellSize: 10, position: { x: 11, y: 10 }, prevPosition: { x: 10, y: 10 }, widgetIds: ['some-id'] },
      type: 'MOVE',
    });
  });

  it('returns same move action when previous position is undefined', () => {
    expect(
      reverseAction({
        type: 'MOVE',
        payload: {
          position: { x: 10, y: 10 },
          prevPosition: undefined,
          widgetIds: ['some-id'],
          cellSize: 10,
        },
      })
    ).toEqual({
      payload: { cellSize: 10, position: { x: 10, y: 10 }, prevPosition: undefined, widgetIds: ['some-id'] },
      type: 'MOVE',
    });
  });
  it('returns the original action when reversed twice', () => {
    expect(
      reverseAction(
        reverseAction({
          type: 'MOVE',
          payload: {
            position: { x: 10, y: 10 },
            prevPosition: { x: 11, y: 10 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        })
      )
    ).toEqual({
      payload: { cellSize: 10, position: { x: 10, y: 10 }, prevPosition: { x: 11, y: 10 }, widgetIds: ['some-id'] },
      type: 'MOVE',
    });
  });
});

describe('reverseActions - RESIZE', () => {
  it('inverts the changeInPosition attribute', () => {
    expect(
      reverseAction({
        type: 'RESIZE',
        payload: {
          anchor: 'bottom',
          changeInPosition: { x: 5, y: 3 },
          widgetIds: ['some-id'],
          cellSize: 10,
        },
      })
    ).toEqual({
      payload: { cellSize: 10, changeInPosition: { x: -5, y: -3 }, widgetIds: ['some-id'], anchor: 'bottom' },
      type: 'RESIZE',
    });
  });

  it('returns the original action when reversed twice', () => {
    expect(
      reverseAction(
        reverseAction({
          type: 'RESIZE',
          payload: {
            anchor: 'bottom',
            changeInPosition: { x: 5, y: 3 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        })
      )
    ).toEqual({
      payload: { cellSize: 10, changeInPosition: { x: 5, y: 3 }, widgetIds: ['some-id'], anchor: 'bottom' },
      type: 'RESIZE',
    });
  });
  it('returns no change when no change in position is made', () => {
    expect(
      reverseAction({
        type: 'RESIZE',
        payload: {
          anchor: 'bottom',
          changeInPosition: { x: 0, y: 0 },
          widgetIds: ['some-id'],
          cellSize: 10,
        },
      })
    ).toEqual({
      payload: { cellSize: 10, changeInPosition: { x: -0, y: -0 }, widgetIds: ['some-id'], anchor: 'bottom' },
      type: 'RESIZE',
    });
  });
});

/** check applying reversals  */
const widget = MockWidgetFactory.getLineChartWidget({ x: 1, y: 1, width: 1, height: 1, id: 'some-id' });
const dashConfig = MockDashboardFactory.get({ widgets: [widget] });

const fractionalConfig = MockDashboardFactory.get({ widgets: [{ ...widget, x: 1.1 }] });
describe('applyReverseActions - case: MOVE', () => {
  it('reverses move action', () => {
    expect(
      applyReverseAction(
        {
          type: 'MOVE',
          payload: {
            position: { x: 10, y: 10 },
            prevPosition: { x: 20, y: 30 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        },
        dashConfig
      )
    ).toEqual({ ...dashConfig, widgets: [{ ...widget, x: 2, y: 3 }] });
  });
  it('returns empty configuration when given one', () => {
    expect(
      applyReverseAction(
        {
          type: 'MOVE',
          payload: {
            position: { x: 10, y: 10 },
            prevPosition: { x: 20, y: 30 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        },
        MOCK_EMPTY_DASHBOARD
      )
    ).toEqual(MOCK_EMPTY_DASHBOARD);
  });
  it('reverses fractional move change', () => {
    expect(
      applyReverseAction(
        {
          type: 'MOVE',
          payload: {
            position: { x: 10, y: 10 },
            prevPosition: { x: 9, y: 10 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        },
        fractionalConfig
      )
    ).toEqual({ ...fractionalConfig, widgets: [{ ...widget, x: 1 }] });
  });
});

describe('applyReverseActions - case: RESIZE', () => {
  const widget = MockWidgetFactory.getLineChartWidget({ x: 5, y: 5, width: 4, height: 4, id: 'some-id' });
  const resizeDashConfig = MockDashboardFactory.get({ widgets: [widget] });
  it('reverses resize action', () => {
    expect(
      applyReverseAction(
        {
          type: 'RESIZE',
          payload: {
            anchor: 'bottom-right',
            changeInPosition: { x: 10, y: 20 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        },
        resizeDashConfig
      )
    ).toEqual({ ...resizeDashConfig, widgets: [{ ...widget, x: 5, y: 5, width: 3, height: 2 }] });
  });

  it('returns no change to the dashboard configuration when changeInPosition is {0,0}', () => {
    expect(
      applyReverseAction(
        {
          type: 'RESIZE',
          payload: {
            anchor: 'bottom-right',
            changeInPosition: { x: 0, y: 0 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        },
        resizeDashConfig
      )
    ).toEqual(resizeDashConfig);
  });
});
