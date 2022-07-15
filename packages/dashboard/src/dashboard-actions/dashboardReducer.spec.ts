import { dashboardReducer } from './dashboardReducer';
import { onMoveAction } from './actions';
import { MOCK_EMPTY_DASHBOARD } from '../testing/mocks';

it('returns empty dashboard configuration when provided an empty dashboard', () => {
  expect(
    dashboardReducer(
      MOCK_EMPTY_DASHBOARD,
      onMoveAction({
        widgetIds: [],
        cellSize: 10,
        position: { x: 10, y: 10 },
        prevPosition: { x: 14, y: 10 },
      })
    )
  ).toEqual(MOCK_EMPTY_DASHBOARD);
});
