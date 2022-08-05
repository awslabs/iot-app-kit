import { reverseResize } from './reverseResize';
import { ResizeAction } from '../actions';
import { DashboardActionType } from '../actions';

const action: ResizeAction = {
  type: DashboardActionType.RESIZE,
  payload: {
    anchor: 'bottom',
    changeInPosition: { x: 5, y: 3 },
    isActionComplete: true,
  },
};
it('inverts the changeInPosition attribute', () => {
  expect(reverseResize(action)).toEqual({
    type: DashboardActionType.RESIZE,
    payload: {
      anchor: 'bottom',
      changeInPosition: { x: -5, y: -3 },
      isActionComplete: true,
    },
  });
});

it('returns the original action when reversed twice', () => {
  expect(reverseResize(reverseResize(action))).toEqual(action);
});

it('returns original action when no change in position', () => {
  expect(
    reverseResize({
      type: DashboardActionType.RESIZE,
      payload: {
        anchor: 'bottom',
        changeInPosition: { x: 0, y: 0 },
        isActionComplete: true,
      },
    })
  ).toEqual({
    payload: {
      anchor: 'bottom',
      changeInPosition: { x: -0, y: -0 },
      isActionComplete: true,
    },
    type: DashboardActionType.RESIZE,
  });
});
