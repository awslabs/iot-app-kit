import { DashboardConfiguration } from '../types';
import { bringToFront } from './bringToFront';
import { MOCK_EMPTY_DASHBOARD, MockWidgetFactory, MockDashboardFactory } from '../testing/mocks';

it('returns empty dashboard when provided empty dashboard', () => {
  expect(bringToFront({ dashboardConfiguration: MOCK_EMPTY_DASHBOARD, widgetIds: [] })).toEqual(MOCK_EMPTY_DASHBOARD);
});

it('returns empty dashboard when provided empty dashboard and non-existent widgetIds', () => {
  expect(bringToFront({ dashboardConfiguration: MOCK_EMPTY_DASHBOARD, widgetIds: ['fake', 'fake-2'] })).toEqual(
    MOCK_EMPTY_DASHBOARD
  );
});

it('moves selected widget to front', () => {
  const MOCK_WIDGET = MockWidgetFactory.getKpiWidget({
    id: 'widget-1',
  });
  const MOCK_WIDGET_2 = MockWidgetFactory.getKpiWidget({
    id: 'widget-2',
    z: MOCK_WIDGET.z - 1, // A z-index lower than `MOCK_WIDGET`'s z-index
  });

  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_WIDGET, MOCK_WIDGET_2] });

  expect(bringToFront({ dashboardConfiguration, widgetIds: [MOCK_WIDGET_2.id] })).toEqual({
    ...dashboardConfiguration,
    widgets: [
      MOCK_WIDGET,
      expect.objectContaining({
        z: MOCK_WIDGET.z + 1,
      }),
    ],
  });
});

it('moves group of widgets and retains their relative order', () => {
  const MOCK_WIDGET = MockWidgetFactory.getKpiWidget({
    id: 'widget-1',
  });
  const MOCK_WIDGET_2 = MockWidgetFactory.getKpiWidget({
    id: 'widget-2',
    z: MOCK_WIDGET.z - 1, // A z-index lower than `MOCK_WIDGET`'s z-index
  });
  const MOCK_WIDGET_3 = MockWidgetFactory.getKpiWidget({
    id: 'widget-3',
    z: MOCK_WIDGET_2.z - 1, // A z-index lower than `MOCK_WIDGET_2`'s z-index
  });

  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_WIDGET, MOCK_WIDGET_2, MOCK_WIDGET_3] });
  expect(
    bringToFront({
      dashboardConfiguration,
      widgetIds: [MOCK_WIDGET_2.id, MOCK_WIDGET_3.id],
    })
  ).toEqual({
    ...dashboardConfiguration,
    widgets: [
      MOCK_WIDGET,
      expect.objectContaining({
        z: MOCK_WIDGET.z + 2,
      }),
      expect.objectContaining({
        z: MOCK_WIDGET.z + 1,
      }),
    ],
  });
});
