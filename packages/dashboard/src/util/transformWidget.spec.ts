import { transformWidget } from './transformWidget';
import { getSelectionBox } from './getSelectionBox';
import { resizeSelectionBox } from './resizeSelectionBox';

import type { Rect, DashboardWidget } from '~/types';
import type { Anchor } from '~/store/actions';
import type { DashboardState } from '~/store/state';

const anchors: Anchor[] = ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'left', 'right'];
const grid = {
  width: 100,
  height: 100,
  cellSize: 1,
} as DashboardState['grid'];
describe('resize single widget', () => {
  const baseWidget: DashboardWidget = {
    id: 'widget',
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: 100,
    type: 'MOCK_WIDGET',
    properties: {},
  };

  const selectionBox: Rect = baseWidget;
  const transformerToBeTested = (newSelectionBox: Rect) => transformWidget(baseWidget, selectionBox, newSelectionBox);

  anchors.forEach((anchor) => {
    const newSelectionBox = resizeSelectionBox({ selectionBox: selectionBox, anchor, vector: { x: 10, y: 10 }, grid });
    const expected: Rect = { ...baseWidget, ...newSelectionBox };
    const result = transformerToBeTested(newSelectionBox);
    const keys = ['x', 'y', 'width', 'height'] as (keyof Rect)[];
    keys.forEach((key) => {
      it(`should resize widget gives correct '${key}' when on ${anchor}`, () => {
        expect(result[key]).toBeCloseTo(expected[key]);
      });
    });
  });
});

describe('resize multiple widgets', () => {
  const widgets = [
    {
      x: 10,
      y: 10,
      z: 0,
      width: 10,
      height: 10,
    },
    {
      x: 20,
      y: 20,
      z: 0,
      width: 10,
      height: 10,
    },
  ] as DashboardWidget[];

  const selectionBox = getSelectionBox(widgets)!;
  const transformerToBeTested = (newSelectionBox: Rect) => (widget: DashboardWidget) =>
    transformWidget(widget, selectionBox, newSelectionBox);

  anchors.forEach((anchor) => {
    const mapper = transformerToBeTested(
      resizeSelectionBox({
        selectionBox: selectionBox,
        anchor,
        vector: { x: 10, y: 10 },
        grid,
      })
    );
    const result = widgets.map(mapper);
    it(`should have two connected widgets stay connected on resize from ${anchor}`, function () {
      expect(result[0].x + result[0].width).toBeCloseTo(result[1].x);
      expect(result[0].y + result[0].height).toBeCloseTo(result[1].y);
    });
  });
});
