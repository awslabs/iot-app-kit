import { paste } from './paste';
import { Widget } from '../types';

const WIDGET: Widget = {
  width: 10,
  height: 10,
  x: 10,
  y: 10,
  widget: 'line-chart',
  id: 'some-id',
};

it('returns empty dashboard when pasting on an empty dashboard with nothing in the copy group', () => {
  expect(
    paste({
      dashboardConfiguration: [],
      copyGroup: [],
      numTimesCopyGroupHasBeenPasted: 0,
    })
  ).toEqual([]);
});

it('paste single widget', () => {
  expect(
    paste({
      dashboardConfiguration: [WIDGET],
      copyGroup: [WIDGET],
      numTimesCopyGroupHasBeenPasted: 0,
    })
  ).toEqual([WIDGET, { ...WIDGET, id: expect.any(String), x: 11, y: 11 }]);
});

it('paste single widget a second time, shifts the position down', () => {
  expect(
    paste({
      dashboardConfiguration: [WIDGET],
      copyGroup: [WIDGET],
      numTimesCopyGroupHasBeenPasted: 2,
    })
  ).toEqual([WIDGET, { ...WIDGET, id: expect.any(String), x: 13, y: 13 }]);
});

it('paste multiple widgets', () => {
  expect(
    paste({
      dashboardConfiguration: [WIDGET],
      copyGroup: [WIDGET, { ...WIDGET, id: 'widget-2', x: 20, y: 20 }],
      numTimesCopyGroupHasBeenPasted: 0,
    })
  ).toEqual([
    WIDGET,
    { ...WIDGET, id: expect.any(String), x: 11, y: 11 },
    { ...WIDGET, id: expect.any(String), x: 21, y: 21 },
  ]);
});
