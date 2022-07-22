import { DeleteAction, CreateAction, onDeleteAction } from '../../types';

export const reverseCreate = (createAction: CreateAction): DeleteAction => {
  const deleteAction: DeleteAction = onDeleteAction({
    widgets: createAction.payload.widgets,
    widgetIds: createAction.payload.widgets.map(({ id }) => id),
  });
  return deleteAction;
};
