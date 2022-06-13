import { dashboardReducer } from './dashboardReducer';
import { onMoveAction } from './actions';
import { Position } from '../types';

describe('dashboardReducer', () => {
  it('returns empty dashboard configuration when provided an empty dashboard', () => {
    const x: number = 7;
    const y: number = 3;
    const origin: Position = { x, y };

    expect(
      dashboardReducer(
        [],
        onMoveAction({
          widgetIds: [],
          cellSize: 10,
          position: origin,
          prevPosition: origin,
        })
      )
    ).toEqual([]);
  });
});
