import { Action, Dispatch } from 'redux';
import { DashboardConfiguration, Position } from '../types';

export const MOVE = 'MOVE';

export interface moveAction extends Action<'MOVE'> {
    type: typeof MOVE;
    payload: {
        /*x: number,
        y: number,
        prevX:number,
        prevY: number,*/
        //z: number,
        position: Position
        prevPosition: Position
        widgetIds: string[]
        cellSize: number
    }
}
export const onMoveAction = (payload: moveAction['payload']): moveAction => ({
    type: MOVE,
    payload,
})

export type dashboardAction = moveAction