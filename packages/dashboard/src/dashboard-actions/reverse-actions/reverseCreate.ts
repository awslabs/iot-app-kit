import { DeleteAction, CreateAction, onDeleteAction } from '../../types';

export const reverseCreate = (createAction: CreateAction): DeleteAction => {
  const deleteAction: DeleteAction = onDeleteAction({
    widgets: createAction.payload.widgets,
    widgetIds: createAction.payload.widgets.map(({ id }) => id),
  });
  console.log('widgets in reverseCreate ', deleteAction.payload.widgets);
  console.log('extracted widget ids in reverseCreate ', deleteAction.payload.widgetIds);

  return deleteAction;
};
