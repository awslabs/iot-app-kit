import { DeleteAction, CreateAction, onCreateAction } from '../../dashboard-actions/actions';

export const reverseDelete = (deleteAction: DeleteAction): CreateAction =>
  onCreateAction({
    widgets: deleteAction.payload.widgets,
  });
