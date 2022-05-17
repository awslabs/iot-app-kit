import { MoveAction } from '../../types';

export const reverseMove = (moveAction: MoveAction): MoveAction => {
  const newMoveAction: MoveAction = moveAction;
  if (typeof moveAction.payload.prevPosition != 'undefined') {
    const tempPosition = moveAction.payload.position;
    newMoveAction.payload.position = moveAction.payload.prevPosition;
    newMoveAction.payload.prevPosition = tempPosition;
    return newMoveAction;
  }

  return newMoveAction;
};
