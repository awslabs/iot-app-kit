import { reverseMove } from './reverseMove';
import { DashboardActionType } from '../actions';
import { MOCK_KPI_WIDGET } from '../../testing/mocks';

it('returns move action where position and prevPosition are switched', () => {
  expect(
    reverseMove({
      type: DashboardActionType.MOVE,
      payload: {
        position: { x: 10, y: 10 },
        prevPosition: { x: 11, y: 10 },
        isActionComplete: true,
        widgetIds: [MOCK_KPI_WIDGET.id],
      },
    })
  ).toEqual({
    payload: {
      position: { x: 11, y: 10 },
      prevPosition: { x: 10, y: 10 },
      isActionComplete: true,
      widgetIds: [MOCK_KPI_WIDGET.id],
    },
    type: DashboardActionType.MOVE,
  });
});

it('returns same move action when previous position is undefined', () => {
  expect(
    reverseMove({
      type: DashboardActionType.MOVE,
      payload: {
        position: { x: 10, y: 10 },
        prevPosition: undefined,
        isActionComplete: true,
        widgetIds: [MOCK_KPI_WIDGET.id],
      },
    })
  ).toEqual({
    payload: {
      position: { x: 10, y: 10 },
      prevPosition: undefined,
      isActionComplete: true,
      widgetIds: [MOCK_KPI_WIDGET.id],
    },
    type: DashboardActionType.MOVE,
  });
});
it('returns the original action when reversed twice', () => {
  expect(
    reverseMove(
      reverseMove({
        type: DashboardActionType.MOVE,
        payload: {
          position: { x: 10, y: 10 },
          prevPosition: { x: 11, y: 10 },
          isActionComplete: true,
          widgetIds: [MOCK_KPI_WIDGET.id],
        },
      })
    )
  ).toEqual({
    payload: {
      position: { x: 10, y: 10 },
      prevPosition: { x: 11, y: 10 },
      isActionComplete: true,
      widgetIds: [MOCK_KPI_WIDGET.id],
    },
    type: DashboardActionType.MOVE,
  });
});
