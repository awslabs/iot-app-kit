import { dashboardReducer } from './dashboardReducer';
import { onMoveAction } from './actions';

it('returns empty dashboard configuration when provided an empty dashboard', () => {
  expect(
    dashboardReducer(
      [],
      onMoveAction({
        widgetIds: [],
        cellSize: 10,
        position: { x: 10, y: 10 },
        prevPosition: { x: 14, y: 10 },
      })
    )
  ).toEqual([]);
});
