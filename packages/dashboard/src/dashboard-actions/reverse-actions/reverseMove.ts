import { MoveAction } from '../../dashboard-actions/actions';

export const reverseMove = (moveAction: MoveAction): MoveAction => {
  if (moveAction.payload.prevPosition && moveAction.payload.widgetIds) {
    return {
      ...moveAction,
      payload: {
        position: moveAction.payload.prevPosition,
        prevPosition: moveAction.payload.position,
        isActionComplete: moveAction.payload.isActionComplete,
        widgetIds: moveAction.payload.widgetIds,
      },
    };
  }

  return moveAction;
};
