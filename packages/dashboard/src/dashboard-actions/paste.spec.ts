import { paste } from './paste';
import { MOCK_WIDGET } from '../testing/mocks';

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
      dashboardConfiguration: [MOCK_WIDGET],
      copyGroup: [MOCK_WIDGET],
      numTimesCopyGroupHasBeenPasted: 0,
    })
  ).toEqual([MOCK_WIDGET, { ...MOCK_WIDGET, id: expect.any(String), x: MOCK_WIDGET.x + 1, y: MOCK_WIDGET.y + 1 }]);
});

it('paste single widget a second time, shifts the position down', () => {
  expect(
    paste({
      dashboardConfiguration: [MOCK_WIDGET],
      copyGroup: [MOCK_WIDGET],
      numTimesCopyGroupHasBeenPasted: 2,
    })
  ).toEqual([MOCK_WIDGET, { ...MOCK_WIDGET, id: expect.any(String), x: MOCK_WIDGET.x + 3, y: MOCK_WIDGET.y + 3 }]);
});

it('paste multiple widgets', () => {
  expect(
    paste({
      dashboardConfiguration: [MOCK_WIDGET],
      copyGroup: [MOCK_WIDGET, { ...MOCK_WIDGET, id: 'widget-2', x: 20, y: 20 }],
      numTimesCopyGroupHasBeenPasted: 0,
    })
  ).toEqual([
    MOCK_WIDGET,
    { ...MOCK_WIDGET, id: expect.any(String), x: MOCK_WIDGET.x + 1, y: MOCK_WIDGET.y + 1 },
    { ...MOCK_WIDGET, id: expect.any(String), x: 21, y: 21 },
  ]);
});
