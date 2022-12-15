import { changeGridProperty } from './updateGrid';
import { initialState } from '../../state';

it('can change a grid property', () => {
  expect(changeGridProperty(initialState, 'cellSize', 20).grid.cellSize).toEqual(20);

  expect(changeGridProperty(initialState, 'width', 10).grid.width).toEqual(10);

  expect(changeGridProperty(initialState, 'height', 10).grid.height).toEqual(10);

  expect(changeGridProperty(initialState, 'stretchToFit', true).grid.stretchToFit).toEqual(true);
});
