import { Viewport } from '@iot-app-kit/core';
import { Store } from 'redux';
import { Action } from 'redux';

export type Widget = {
  id: string;
  widget: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
};

export type Anchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right' | 'top' | 'bottom';

export type DashboardConfiguration = Widget[];

export type DashboardStore = Store<DashboardConfiguration, DashboardAction>;

export type Position = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

// Anchor specifies which portion of the selection box is initiating the resize.
// Current position is the position the cursor is, relative to the dashboard grid in pixels.
export type OnResize = ({ anchor, currentPosition }: { anchor: Anchor; currentPosition: Position }) => void;

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

export type MoveActionInput = MoveAction['payload'];

export const onMoveAction = (payload: MoveActionInput): MoveAction => ({
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

export type ResizeActionInput = ResizeAction['payload'];

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
    copyGroup: Widget[];
    numTimesCopyGroupHasBeenPasted: number;
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

export type DashboardAction =
  | MoveAction
  | ResizeAction
  | DeleteAction
  | PasteAction
  | CreateAction
  | UndoAction
  | VoidAction
  | RedoAction;

export const VOID = 'VOID';

export interface VoidAction extends Action<'VOID'> {
  type: typeof VOID;
  payload: {};
}

export const onVoidAction = (): VoidAction => ({
  type: VOID,
  payload: {},
});

export type UndoQueue = DashboardAction[];
