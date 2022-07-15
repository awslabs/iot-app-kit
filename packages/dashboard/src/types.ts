import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest, Viewport } from '@iot-app-kit/core';
import { Annotations, ChartConfig, MinimalViewPortConfig } from '@synchro-charts/core';
import { Store } from 'redux';
import { Action } from 'redux';

export type Widget = {
  id: string;
  componentTag: string;
  title?: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  properties?: ChartConfig;
  annotations?: Annotations;
};

export type Anchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right' | 'top' | 'bottom';

export type DashboardConfiguration = {
  widgets: Widget[];
  viewport: MinimalViewPortConfig;
};

export type DashboardStore = Store<DashboardReducerState, DashboardAction>;

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
    dashboardConfiguration: DashboardConfiguration;
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
  payload: {};
}

export type StretchToFitActionInput = StretchToFitAction['payload'];

export const onStretchToFitAction = (): StretchToFitAction => ({
  type: STRETCHTOFIT,
  payload: {},
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
  payload: {};
}

export const onVoidAction = (): VoidAction => ({
  type: VOID,
  payload: {},
});

export type UndoQueue = DashboardAction[];

export type DashboardReducerState = {
  dashboardConfiguration: DashboardConfiguration;
  selectedWidgetIds: string[];
  numTimesCopyGroupHasBeenPasted: number;
  copyGroup: Widget[];
  stretchToFit: boolean;
  width: number;
  cellSize: number;
};
