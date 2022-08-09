import { reverseMove } from './reverseMove';
import { DashboardActionType } from '../actions';

it('returns move action where position and prevPosition are switched', () => {
  expect(
    reverseMove({
      type: DashboardActionType.MOVE,
      payload: {
        position: { x: 10, y: 10 },
        prevPosition: { x: 11, y: 10 },
        isActionComplete: true,
      },
    })
  ).toEqual({
    payload: {
      position: { x: 11, y: 10 },
      prevPosition: { x: 10, y: 10 },
      isActionComplete: true,
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
      },
    })
  ).toEqual({
    payload: {
      position: { x: 10, y: 10 },
      prevPosition: undefined,
      isActionComplete: true,
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
        },
      })
    )
  ).toEqual({
    payload: {
      position: { x: 10, y: 10 },
      prevPosition: { x: 11, y: 10 },
      isActionComplete: true,
    },
    type: DashboardActionType.MOVE,
  });
});
