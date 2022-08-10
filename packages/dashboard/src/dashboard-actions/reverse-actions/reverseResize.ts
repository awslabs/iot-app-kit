import { ResizeAction } from '../../dashboard-actions/actions';

export const reverseResize = (resizeAction: ResizeAction): ResizeAction => {
  return {
    ...resizeAction,
    payload: {
      anchor: resizeAction.payload.anchor,
      changeInPosition: {
        x: resizeAction.payload.changeInPosition.x * -1,
        y: resizeAction.payload.changeInPosition.y * -1,
      },
      isActionComplete: true,
      widgetIds: resizeAction.payload.widgetIds,
    },
  };
};
