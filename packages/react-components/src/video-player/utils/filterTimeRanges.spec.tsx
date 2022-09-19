import { filterTimerangesForVideoOnEdge } from './filterTimeRanges';

it('should format the date to DateTime value', () => {
  const timerangesWithSource = [
    { start: 1, end: 5, src: 'mockOnDemandURL-1' },
    { start: 7, end: 9, src: 'mockOnDemandURL-2' },
    { start: 15, end: 18, src: 'mockOnDemandURL-3' },
    { start: 24, end: 26, src: 'mockOnDemandURL-4' },
  ];
  const timerangesForVideoOnEdgeRaw = [
    { start: 1, end: 5 },
    { start: 7, end: 11 },
    { start: 13, end: 18 },
    { start: 21, end: 28 },
    { start: 32, end: 35 },
  ];
  const expectedResult = [
    { start: 9, end: 11 },
    { start: 13, end: 15 },
    { start: 21, end: 24 },
    { start: 26, end: 28 },
    { start: 32, end: 35 },
  ];
  expect(filterTimerangesForVideoOnEdge(timerangesForVideoOnEdgeRaw, timerangesWithSource)).toEqual(expectedResult);
});
