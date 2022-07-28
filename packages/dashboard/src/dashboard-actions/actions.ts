import { Action } from 'redux';
import { Position, Anchor, Widget, DashboardConfiguration } from '../types';

export const MOVE = 'MOVE';

export interface MoveAction extends Action<'MOVE'> {
  type: typeof MOVE;
  payload: {
    position: Position;
    prevPosition: Position | undefined;
    widgetIds: string[];
    cellSize: number;
  };
}
export const onMoveAction = (payload: MoveAction['payload']): MoveAction => ({
  type: MOVE,
  payload,
});

export const RESIZE = 'RESIZE';

export interface ResizeAction extends Action<'RESIZE'> {
  type: typeof RESIZE;
  payload: {
    anchor: Anchor;
    changeInPosition: Position;
    widgetIds: string[];
    cellSize: number;
  };
}
export const onResizeAction = (payload: ResizeAction['payload']): ResizeAction => ({
  type: RESIZE,
  payload,
});

export const DELETE = 'DELETE';

export interface DeleteAction extends Action<'DELETE'> {
  type: typeof DELETE;
  payload: {
    widgetIds: string[];
    widgets: Widget[];
  };
}
export const onDeleteAction = (payload: DeleteAction['payload']): DeleteAction => ({
  type: DELETE,
  payload,
});

export type DeleteActionInput = DeleteAction['payload'];

export const PASTE = 'PASTE';

export interface PasteAction extends Action<'PASTE'> {
  type: typeof PASTE;
  payload: {
    numTimesPasted: number;
    copyGroup: Widget[];
  };
}
export const onPasteAction = (payload: PasteAction['payload']): PasteAction => ({
  type: PASTE,
  payload,
});

export type PasteActionInput = PasteAction['payload'];

export const CREATE = 'CREATE';

export interface CreateAction extends Action<'CREATE'> {
  type: typeof CREATE;
  payload: {
    dashboardConfiguration: DashboardConfiguration;
    widgets: Widget[];
  };
}

export const onCreateAction = (payload: CreateAction['payload']): CreateAction => ({
  type: CREATE,
  payload,
});

export type CreateActionInput = CreateAction['payload'];

export const REDO = 'REDO';

export interface RedoAction extends Action<'REDO'> {
  type: typeof REDO;
  payload: {
    redoAction: DashboardAction;
  };
}

export type RedoActionInput = RedoAction['payload'];

export const onRedoAction = (payload: RedoActionInput): RedoAction => ({
  type: REDO,
  payload,
});

export const COPY = 'COPY';

export interface CopyAction extends Action<'COPY'> {
  type: typeof COPY;
  payload: {
    copyGroup: Widget[];
  };
}

export type CopyActionInput = CopyAction['payload'];

export const onCopyAction = (payload: CopyActionInput): CopyAction => ({
  type: COPY,
  payload,
});

export const UNDO = 'UNDO';

export interface UndoAction extends Action<'UNDO'> {
  type: typeof UNDO;
  payload: {
    undoAction: DashboardAction;
  };
}

export type UndoActionInput = UndoAction['payload'];

export const onUndoAction = (payload: UndoActionInput): UndoAction => ({
  type: UNDO,
  payload,
});

export const REDOPASTE = 'REDOPASTE';

export interface RedoPasteAction extends Action<'REDOPASTE'> {
  type: typeof REDOPASTE;
  payload: {
    numTimesPasted: number;
    copyGroup: Widget[];
  };
}

export type RedoPasteActionInput = RedoPasteAction['payload'];

export const onRedoPasteAction = (payload: RedoPasteActionInput): RedoPasteAction => ({
  type: REDOPASTE,
  payload,
});

export const STRETCHTOFIT = 'STRETCHTOFIT';

export interface StretchToFitAction extends Action<'STRETCHTOFIT'> {
  type: typeof STRETCHTOFIT;
}

export type StretchToFitActionInput = StretchToFitAction;

export const onStretchToFitAction = (): StretchToFitAction => ({
  type: STRETCHTOFIT,
});

export const EDITCELLSIZE = 'EDITCELLSIZE';

export interface EditCellSizeAction extends Action<'EDITCELLSIZE'> {
  type: typeof EDITCELLSIZE;
  payload: {
    cellSize: number;
  };
}

export type EditCellSizeActionInput = EditCellSizeAction['payload'];

export const onEditCellSizeAction = (payload: EditCellSizeActionInput): EditCellSizeAction => ({
  type: EDITCELLSIZE,
  payload,
});
export const EDITWIDTH = 'EDITWIDTH';

export interface EditWidthAction extends Action<'EDITWIDTH'> {
  type: typeof EDITWIDTH;
  payload: {
    width: number;
  };
}

export type EditWidthActionInput = EditWidthAction['payload'];

export const onEditWidthAction = (payload: EditWidthActionInput): EditWidthAction => ({
  type: EDITWIDTH,
  payload,
});
export type DashboardAction =
  | MoveAction
  | ResizeAction
  | DeleteAction
  | PasteAction
  | CopyAction
  | CreateAction
  | UndoAction
  | VoidAction
  | RedoAction
  | StretchToFitAction
  | EditCellSizeAction
  | EditWidthAction;

export const VOID = 'VOID';

export interface VoidAction extends Action<'VOID'> {
  type: typeof VOID;
}

export const onVoidAction = (): VoidAction => ({
  type: VOID,
});