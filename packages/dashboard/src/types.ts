import { Viewport } from '@iot-app-kit/core';
import { Store } from 'redux';
import { Action } from 'redux';

export type Widget = {
  id: string;
  widget: string;
  x: number;
  y: number;
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

export type DashboardAction = MoveAction | ResizeAction;
