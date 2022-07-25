import { reverseResize } from './reverseResize';

it('inverts the changeInPosition attribute', () => {
  expect(
    reverseResize({
      type: 'RESIZE',
      payload: {
        anchor: 'bottom',
        changeInPosition: { x: 5, y: 3 },
        widgetIds: ['some-id'],
        cellSize: 10,
        dashboardConfiguration: {widgets: [], viewport: {"duration": "5m"}}
      },
    })
  ).toEqual({
    payload: { cellSize: 10, changeInPosition: { x: -5, y: -3 }, widgetIds: ['some-id'], anchor: 'bottom' },
    type: 'RESIZE',
  });
});

it('returns the original action when reversed twice', () => {
  expect(
    reverseResize(
      reverseResize({
        type: 'RESIZE',
        payload: {
          anchor: 'bottom',
          changeInPosition: { x: 5, y: 3 },
          widgetIds: ['some-id'],
          cellSize: 10,
          dashboardConfiguration: {widgets: [], viewport: {"duration": "5m"}}
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
    reverseResize({
      type: 'RESIZE',
      payload: {
        anchor: 'bottom',
        changeInPosition: { x: 0, y: 0 },
        widgetIds: ['some-id'],
        cellSize: 10,
        dashboardConfiguration: {widgets: [], viewport: {"duration": "5m"}}
      },
    })
  ).toEqual({
    payload: { cellSize: 10, changeInPosition: { x: -0, y: -0 }, widgetIds: ['some-id'], anchor: 'bottom' },
    type: 'RESIZE',
  });
});
