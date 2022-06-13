import { dashboardReducer } from './dashboardReducer';
import {moveAction, onMoveAction} from './actions'
import { DashboardConfiguration, Position } from '../types';

describe('dashboardReducer', () => {
  it('returns empty dashboard configuration when provided an empty dashboard', () => {
    const x:number = 7;
    const y: number = 3;
    const origin:Position = { x, y};
    
    expect(
      dashboardReducer(
          [],
          onMoveAction({
              widgetIds: [],
              cellSize: 10,
              position: origin,
              prevPosition: origin
          })
      )
    ).toEqual([]);
  });
});
