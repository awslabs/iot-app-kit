import { DashboardConfiguration } from '../types';
import { bringToBack } from './bringToBack';
import { MOCK_EMPTY_DASHBOARD, MockWidgetFactory, MockDashboardFactory } from '../testing/mocks';

it('returns empty dashboard when provided empty dashboard', () => {
  expect(bringToBack({ dashboardConfiguration: MOCK_EMPTY_DASHBOARD, widgetIds: [] })).toEqual(MOCK_EMPTY_DASHBOARD);
});

it('returns empty dashboard when provided empty dashboard and non-existent widgetIds', () => {
  expect(bringToBack({ dashboardConfiguration: MOCK_EMPTY_DASHBOARD, widgetIds: ['fake', 'fake-2'] })).toEqual(
    MOCK_EMPTY_DASHBOARD
  );
});

it('moves selected widget to back', () => {
  const MOCK_WIDGET = MockWidgetFactory.getKpiWidget({
    id: 'widget-1',
  });
  const MOCK_WIDGET_2 = MockWidgetFactory.getKpiWidget({
    id: 'widget-2',
    z: MOCK_WIDGET.z - 1, // A z-index lower than `MOCK_WIDGET`'s z-index
  });

  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_WIDGET, MOCK_WIDGET_2] });
  expect(bringToBack({ dashboardConfiguration, widgetIds: [MOCK_WIDGET.id] })).toEqual({
    ...dashboardConfiguration,
    widgets: [
      expect.objectContaining({
        z: MOCK_WIDGET.z - 2,
      }),
      MOCK_WIDGET_2,
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
    bringToBack({
      dashboardConfiguration,
      widgetIds: [MOCK_WIDGET.id, MOCK_WIDGET_2.id],
    })
  ).toEqual({
    ...dashboardConfiguration,
    widgets: [
      expect.objectContaining({
        z: MOCK_WIDGET_3.z - 1,
      }),
      expect.objectContaining({
        z: MOCK_WIDGET_3.z - 2,
      }),
      MOCK_WIDGET_3,
    ],
  });
});
