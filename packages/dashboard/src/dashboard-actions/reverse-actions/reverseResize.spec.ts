import { reverseResize } from './reverseResize';
import { MOCK_KPI_WIDGET } from '../../testing/mocks';

it('inverts the changeInPosition attribute', () => {
  expect(
    reverseResize({
      type: 'RESIZE',
      payload: {
        anchor: 'bottom',
        changeInPosition: { x: 5, y: 3 },
        widgetIds: [MOCK_KPI_WIDGET.id],
        dashboardConfiguration: {
          widgets: [MOCK_KPI_WIDGET],
          viewport: { duration: '5m' },
        },
        cellSize: 10,
      },
    })
  ).toEqual({
    payload: {
      anchor: 'bottom',
      changeInPosition: { x: -5, y: -3 },
      widgetIds: [MOCK_KPI_WIDGET.id],
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      cellSize: 10,
    },
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
          widgetIds: [MOCK_KPI_WIDGET.id],
          dashboardConfiguration: {
            widgets: [MOCK_KPI_WIDGET],
            viewport: { duration: '5m' },
          },
          cellSize: 10,
        },
      })
    )
  ).toEqual({
    payload: {
      anchor: 'bottom',
      changeInPosition: { x: 5, y: 3 },
      widgetIds: [MOCK_KPI_WIDGET.id],
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      cellSize: 10,
    },
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
        widgetIds: [MOCK_KPI_WIDGET.id],
        dashboardConfiguration: {
          widgets: [MOCK_KPI_WIDGET],
          viewport: { duration: '5m' },
        },
        cellSize: 10,
      },
    })
  ).toEqual({
    payload: {
      anchor: 'bottom',
      changeInPosition: { x: -0, y: -0 },
      widgetIds: [MOCK_KPI_WIDGET.id],
      dashboardConfiguration: {
        widgets: [MOCK_KPI_WIDGET],
        viewport: { duration: '5m' },
      },
      cellSize: 10,
    },
    type: 'RESIZE',
  });
});
