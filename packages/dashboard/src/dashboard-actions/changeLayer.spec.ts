import { changeLayer } from './changeLayer';
import {
  MOCK_EMPTY_DASHBOARD,
  MockWidgetFactory,
  MockDashboardFactory,
  MOCK_KPI_WIDGET,
  MOCK_LINE_CHART_WIDGET,
} from '../testing/mocks';

it('returns empty dashboard when provided empty dashboard', () => {
  expect(changeLayer({ dashboardConfiguration: MOCK_EMPTY_DASHBOARD, widgets: [], zOffset: 0 })).toEqual(
    MOCK_EMPTY_DASHBOARD
  );
});

it('returns empty dashboard when provided empty dashboard and non-existent widgets', () => {
  expect(
    changeLayer({
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
      widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
      zOffset: 0,
    })
  ).toEqual(MOCK_EMPTY_DASHBOARD);
});

it('moves selected widgets by an offset', () => {
  const MOCK_WIDGET = MockWidgetFactory.getKpiWidget({
    id: 'widget-1',
  });
  const MOCK_WIDGET_2 = MockWidgetFactory.getKpiWidget({
    id: 'widget-2',
    z: MOCK_WIDGET.z - 1, // A z-index lower than `MOCK_WIDGET`'s z-index
  });

  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_WIDGET, MOCK_WIDGET_2] });

  expect(changeLayer({ dashboardConfiguration, widgets: [MOCK_WIDGET, MOCK_WIDGET_2], zOffset: 1 })).toEqual({
    ...dashboardConfiguration,
    widgets: [
      expect.objectContaining({
        z: MOCK_WIDGET.z + 1,
      }),
      expect.objectContaining({
        z: MOCK_WIDGET_2.z + 1,
      }),
    ],
  });

  expect(changeLayer({ dashboardConfiguration, widgets: [MOCK_WIDGET, MOCK_WIDGET_2], zOffset: -1 })).toEqual({
    ...dashboardConfiguration,
    widgets: [
      expect.objectContaining({
        z: MOCK_WIDGET.z - 1,
      }),
      expect.objectContaining({
        z: MOCK_WIDGET_2.z - 1,
      }),
    ],
  });
});
