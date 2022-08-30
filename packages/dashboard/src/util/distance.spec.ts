import { distance } from './distance';

it('can calculate the distance between 2 points', () => {
  expect(distance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
  expect(distance({ x: 0, y: 3 }, { x: 4, y: 0 })).toBe(5);
});
