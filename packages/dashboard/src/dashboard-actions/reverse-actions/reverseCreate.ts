import { DeleteAction, CreateAction, onDeleteAction } from '../../dashboard-actions/actions';

export const reverseCreate = (createAction: CreateAction): DeleteAction =>
  onDeleteAction({ widgets: createAction.payload.widgets });
