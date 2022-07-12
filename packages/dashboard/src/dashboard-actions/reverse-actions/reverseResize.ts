import { ResizeAction } from '../../types';

export const reverseResize = (resizeAction: ResizeAction): ResizeAction => {
  const newResizeAction: ResizeAction = resizeAction;
  newResizeAction.payload.changeInPosition.x = resizeAction.payload.changeInPosition.x * -1;
  newResizeAction.payload.changeInPosition.y = resizeAction.payload.changeInPosition.y * -1;
  return newResizeAction;
};
