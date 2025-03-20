import type { Anchor } from '~/store/actions';
import type { DashboardState } from '~/store/state';
import type { Rectangle } from '~/types';
import { transformWidget } from './transformWidget';
import { getSelectionBox } from './getSelectionBox';
import { resizeSelectionBox } from './resizeSelectionBox';
import { type WidgetInstance } from '~/features/widget-instance/instance';

const anchors: Anchor[] = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'right',
];
const grid = {
  width: 100,
  height: 100,
  cellSize: 1,
} as DashboardState['grid'];
describe('resize single widget', () => {
  const baseWidget: WidgetInstance = {
    id: 'widget',
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: 100,
    type: 'text',
    properties: {
      value: '',
    },
  };

  const selectionBox: Rectangle = baseWidget;
  const transformerToBeTested = (newSelectionBox: Rectangle) =>
    transformWidget(baseWidget, selectionBox, newSelectionBox);

  anchors.forEach((anchor) => {
    const newSelectionBox = resizeSelectionBox({
      selectionBox: selectionBox,
      anchor,
      vector: { x: 10, y: 10 },
      grid,
    });
    const expected: Rectangle = { ...baseWidget, ...newSelectionBox };
    const result = transformerToBeTested(newSelectionBox);
    const keys = ['x', 'y', 'width', 'height'] as (keyof Rectangle)[];
    keys.forEach((key) => {
      it(`should resize widget gives correct '${key}' when on ${anchor}`, () => {
        expect(result[key]).toBeCloseTo(expected[key]);
      });
    });
  });
});

describe('resize multiple widget-instance', () => {
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
  ] as WidgetInstance[];

  const selectionBox = getSelectionBox(widgets)!;
  const transformerToBeTested =
    (newSelectionBox: Rectangle) => (widget: WidgetInstance) =>
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
