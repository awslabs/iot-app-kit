import { resizeSelectionBox } from '~/util/resizeSelectionBox';
import type { Anchor } from '~/store/actions';

it('should resize selection box on top anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'top';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 10, width: 100, height: 90 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

it('should resize selection box on top-left anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'top-left';
  const vector = { x: 10, y: 10 };
  const expected = { x: 10, y: 10, width: 90, height: 90 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

it('should resize selection box on top-right anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'top-right';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 10, width: 110, height: 90 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

it('should resize selection box on bottom anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'bottom';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 0, width: 100, height: 110 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

it('should resize selection box on bottom-left anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'bottom-left';
  const vector = { x: 10, y: 10 };
  const expected = { x: 10, y: 0, width: 90, height: 110 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

it('should resize selection box on bottom-right anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'bottom-right';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 0, width: 110, height: 110 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

it('should resize selection box on left anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'left';
  const vector = { x: 10, y: 10 };
  const expected = { x: 10, y: 0, width: 90, height: 100 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

it('should resize selection box on right anchor', () => {
  const curr = { x: 0, y: 0, width: 100, height: 100 };
  const anchor = 'right';
  const vector = { x: 10, y: 10 };
  const expected = { x: 0, y: 0, width: 110, height: 100 };
  expect(resizeSelectionBox({ selectionBox: curr, anchor, vector })).toEqual(expected);
});

describe('should not vertically resize selection box below minimum width', () => {
  const curr = { x: 50, y: 50, width: 2, height: 100 };
  const leftAnchors: Anchor[] = ['top', 'top-left', 'bottom-left'];
  leftAnchors.forEach((anchor) => {
    const vector = { x: 10, y: 10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector }).width).toEqual(2);
    });
  });

  const rightAnchors: Anchor[] = ['top-right', 'bottom-right', 'right'];
  rightAnchors.forEach((anchor) => {
    const vector = { x: -10, y: 10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector }).width).toEqual(2);
    });
  });
});

describe('should not horizontally resize selection box below minimum height', () => {
  const curr = { x: 50, y: 50, width: 100, height: 2 };
  const topAnchors: Anchor[] = ['top', 'top-left', 'top-right'];
  topAnchors.forEach((anchor) => {
    const vector = { x: 10, y: 10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector }).height).toEqual(2);
    });
  });

  const bottomAnchors: Anchor[] = ['bottom-left', 'bottom-right', 'bottom'];
  bottomAnchors.forEach((anchor) => {
    const vector = { x: 10, y: -10 };
    it(`should not resize selection box on ${anchor} anchor`, () => {
      expect(resizeSelectionBox({ selectionBox: curr, anchor, vector }).height).toEqual(2);
    });
  });
});
