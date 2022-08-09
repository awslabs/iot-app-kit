import { MoveAction } from '../../dashboard-actions/actions';

export const reverseMove = (moveAction: MoveAction): MoveAction => {
  const newMoveAction = moveAction;
  if (typeof moveAction.payload.prevPosition != 'undefined') {
    return {
      ...moveAction,
      payload: {
        position: moveAction.payload.prevPosition,
        prevPosition: moveAction.payload.position,
        isActionComplete: moveAction.payload.isActionComplete,
      },
    };
  }

  return newMoveAction;
};
