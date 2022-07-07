import { undo } from './undo';

const dashConfig = [{ x: 1, y: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }];

const fractionalConfig = [{ x: 1.1, y: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }];
describe('MOVE', () => {
  it('reverses move action', () => {
    expect(
      undo(
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
    ).toEqual([{ x: 2, y: 3, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }]);
  });
  it('returns empty configuration when given one', () => {
    expect(
      undo(
        {
          type: 'MOVE',
          payload: {
            position: { x: 10, y: 10 },
            prevPosition: { x: 20, y: 30 },
            widgetIds: ['some-id'],
            cellSize: 10,
          },
        },
        []
      )
    ).toEqual([]);
  });
  it('reverses fractional move change', () => {
    expect(
      undo(
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
    ).toEqual([{ x: 1, y: 1, width: 1, height: 1, id: 'some-id', widget: 'line-chart' }]);
  });
});

describe('RESIZE', () => {
  const resizeDashConfig = [{ x: 5, y: 5, width: 4, height: 4, id: 'some-id', widget: 'line-chart' }];
  it('reverses resize action', () => {
    expect(
      undo(
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
    ).toEqual([{ x: 5, y: 5, width: 3, height: 2, id: 'some-id', widget: 'line-chart' }]);
  });

  it('returns no change to the dashboard configuration when changeInPosition is {0,0}', () => {
    expect(
      undo(
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
