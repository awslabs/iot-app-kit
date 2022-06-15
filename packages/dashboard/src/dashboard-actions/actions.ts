import { Action } from 'redux';
import { Position } from '../types';

export const MOVE = 'MOVE';

export interface MoveAction extends Action<'MOVE'> {
  type: typeof MOVE;
  payload: {
    position: Position;
    prevPosition: Position;
    widgetIds: string[];
    cellSize: number;
  };
}
export const onMoveAction = (payload: MoveAction['payload']): MoveAction => ({
  type: MOVE,
  payload,
});

export type DashboardAction = MoveAction;
