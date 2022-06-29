import { bringToFront } from './bringToFront';
import { MOCK_WIDGET } from '../testing/mocks';

it('returns empty dashboard when provided empty dashboard', () => {
  expect(bringToFront({ dashboardConfiguration: [], widgetIds: [] })).toEqual([]);
});

it('returns empty dashboard when provided empty dashboard and non-existent widgetIds', () => {
  expect(bringToFront({ dashboardConfiguration: [], widgetIds: ['fake', 'fake-2'] })).toEqual([]);
});

it('moves selected widget to front', () => {
  const MOCK_WIDGET_2 = {
    ...MOCK_WIDGET,
    id: 'widget-2',
    z: MOCK_WIDGET.z - 1, // A z-index lower than `MOCK_WIDGET`'s z-index
  };

  expect(bringToFront({ dashboardConfiguration: [MOCK_WIDGET, MOCK_WIDGET_2], widgetIds: [MOCK_WIDGET_2.id] })).toEqual(
    [
      MOCK_WIDGET,
      expect.objectContaining({
        z: MOCK_WIDGET.z + 1,
      }),
    ]
  );
});

it('moves group of widgets and retains their relative order', () => {
  const MOCK_WIDGET_2 = {
    ...MOCK_WIDGET,
    id: 'widget-2',
    z: MOCK_WIDGET.z - 1, // A z-index lower than `MOCK_WIDGET`'s z-index
  };

  const MOCK_WIDGET_3 = {
    ...MOCK_WIDGET,
    id: 'widget-3',
    z: MOCK_WIDGET.z - 2, // A z-index lower than `MOCK_WIDGET_2`'s z-index
  };

  expect(
    bringToFront({
      dashboardConfiguration: [MOCK_WIDGET, MOCK_WIDGET_2, MOCK_WIDGET_3],
      widgetIds: [MOCK_WIDGET_2.id, MOCK_WIDGET_3.id],
    })
  ).toEqual([
    MOCK_WIDGET,
    expect.objectContaining({
      z: MOCK_WIDGET.z + 2,
    }),
    expect.objectContaining({
      z: MOCK_WIDGET.z + 1,
    }),
  ]);
});
