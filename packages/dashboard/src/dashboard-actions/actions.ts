import { Action } from 'redux';
import { Position, Anchor, Widget, DashboardState } from '../types';

export enum DashboardActionType {
  MOVE = 'MOVE',
  RESIZE = 'RESIZE',
  DELETE = 'DELETE',
  PASTE = 'PASTE',
  CREATE = 'CREATE',
  REDO = 'REDO',
  COPY = 'COPY',
  UNDO = 'UNDO',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  BRING_TO_FRONT = 'BRING_TO_FRONT',
  SEND_TO_BACK = 'SEND_TO_BACK',
}

export interface MoveAction extends Action<DashboardActionType.MOVE> {
  type: typeof DashboardActionType.MOVE;
  payload: {
    position: Position;
    prevPosition?: Position;
    isActionComplete: boolean;
    widgetIds?: string[];
  };
}
export const onMoveAction = (payload: MoveAction['payload']): MoveAction => ({
  type: DashboardActionType.MOVE,
  payload,
});

export type MoveActionInput = MoveAction['payload'];

export interface ResizeAction extends Action<DashboardActionType.RESIZE> {
  type: typeof DashboardActionType.RESIZE;
  payload: {
    anchor: Anchor;
    changeInPosition: Position;
    isActionComplete: boolean;
    widgetIds?: string[];
  };
}
export const onResizeAction = (payload: ResizeAction['payload']): ResizeAction => ({
  type: DashboardActionType.RESIZE,
  payload,
});

export type ResizeActionInput = ResizeAction['payload'];

export interface DeleteAction extends Action<DashboardActionType.DELETE> {
  type: typeof DashboardActionType.DELETE;
  payload: {
    widgets: Widget[];
  };
}
export const onDeleteAction = (payload: DeleteAction['payload']): DeleteAction => ({
  type: DashboardActionType.DELETE,
  payload,
});

export type DeleteActionInput = DeleteAction['payload'];

export interface PasteAction extends Action<DashboardActionType.PASTE> {
  type: typeof DashboardActionType.PASTE;
  payload?: Position;
}

export type PasteActionInput = PasteAction['payload'];

export const onPasteAction = (payload?: PasteAction['payload']): PasteAction => ({
  type: DashboardActionType.PASTE,
  payload,
});

export interface CreateAction extends Action<DashboardActionType.CREATE> {
  type: typeof DashboardActionType.CREATE;
  payload: {
    widgets: Widget[];
  };
}

export const onCreateAction = (payload: CreateAction['payload']): CreateAction => ({
  type: DashboardActionType.CREATE,
  payload,
});

export type CreateActionInput = CreateAction['payload'];

export interface RedoAction extends Action<DashboardActionType.REDO> {
  type: typeof DashboardActionType.REDO;
}

export const onRedoAction = (): RedoAction => ({
  type: DashboardActionType.REDO,
});

export interface CopyAction extends Action<DashboardActionType.COPY> {
  type: typeof DashboardActionType.COPY;
}

export const onCopyAction = (): CopyAction => ({
  type: DashboardActionType.COPY,
});

export interface UndoAction extends Action<DashboardActionType.UNDO> {
  type: typeof DashboardActionType.UNDO;
}

export const onUndoAction = (): UndoAction => ({
  type: DashboardActionType.UNDO,
});

export interface SelectAction extends Action<DashboardActionType.SELECT> {
  type: typeof DashboardActionType.SELECT;
  payload: {
    widgetIds: string[];
  };
}

export type SelectActionInput = SelectAction['payload'];

export const onSelectAction = (payload: SelectActionInput): SelectAction => ({
  type: DashboardActionType.SELECT,
  payload,
});

export interface UpdateAction extends Action<DashboardActionType.UPDATE> {
  type: typeof DashboardActionType.UPDATE;
  payload: {
    fieldsToUpdate: Partial<DashboardState>;
    previousField: Partial<DashboardState>;
  };
}

export type UpdateActionInput = UpdateAction['payload'];

export const onUpdateAction = (payload: UpdateActionInput): UpdateAction => ({
  type: DashboardActionType.UPDATE,
  payload,
});

export interface BringToFrontAction extends Action<DashboardActionType.BRING_TO_FRONT> {
  type: typeof DashboardActionType.BRING_TO_FRONT;
  payload: {
    widgets: Widget[];
  };
}
export const onBringToFrontAction = (payload: BringToFrontAction['payload']): BringToFrontAction => ({
  type: DashboardActionType.BRING_TO_FRONT,
  payload,
});

export type BringToFrontActionInput = SendToBackAction['payload'];

export interface SendToBackAction extends Action<DashboardActionType.SEND_TO_BACK> {
  type: typeof DashboardActionType.SEND_TO_BACK;
  payload: {
    widgets: Widget[];
  };
}
export const onSendToBackAction = (payload: SendToBackAction['payload']): SendToBackAction => ({
  type: DashboardActionType.SEND_TO_BACK,
  payload,
});

export type SendToBackActionInput = SendToBackAction['payload'];

export type DashboardAction =
  | MoveAction
  | ResizeAction
  | DeleteAction
  | PasteAction
  | CopyAction
  | CreateAction
  | UndoAction
  | RedoAction
  | UpdateAction
  | SelectAction
  | BringToFrontAction
  | SendToBackAction;
