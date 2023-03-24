import { moveSelectionBox } from '~/util/moveSelectionBox';

import { DashboardState } from '~/store/state';

const grid = {
  width: 100,
  height: 100,
  cellSize: 1,
} as DashboardState['grid'];
describe('moveSelectionBox', () => {
  const widget1 = { x: 0, y: 0, width: 10, height: 10 };

  it('should move selection box', () => {
    const selectionBox = widget1;
    const vector = { x: 10, y: 10 };
    const expected = { x: 10, y: 10, width: 10, height: 10 };
    expect(moveSelectionBox({ selectionBox, vector, grid })).toEqual(expected);
  });

  it('should not move selection box if it is out of bounds', () => {
    const selectionBox = widget1;
    const vector = { x: 100, y: 100 };
    const expected = { x: 90, y: 90, width: 10, height: 10 };
    expect(moveSelectionBox({ selectionBox, vector, grid })).toEqual(expected);
  });
});
