import { reverseMove } from './reverseMove';
it('returns move action where position and prevPosition are switched', () => {
  expect(
    reverseMove({
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
    reverseMove({
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
    reverseMove(
      reverseMove({
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
