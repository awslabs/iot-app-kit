import { bringWidgetsToFront } from '.';
import { initialState } from '../../state';

import { MOCK_KPI_WIDGET, MockWidgetFactory } from '../../../../testing/mocks';
import type { DashboardState } from '../../state';
import type { DashboardWidget } from '~/types';

const setupDashboardState = (
  widgets: DashboardWidget[] = [],
  selectedWidgets: DashboardWidget[] = []
): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  selectedWidgets,
});

it('does nothing if there are no widgets selected', () => {
  expect(bringWidgetsToFront(setupDashboardState([MOCK_KPI_WIDGET])).dashboardConfiguration.widgets).toEqual([
    MOCK_KPI_WIDGET,
  ]);
});

it('does nothing if there all widgets are selected', () => {
  expect(
    bringWidgetsToFront(setupDashboardState([MOCK_KPI_WIDGET], [MOCK_KPI_WIDGET])).dashboardConfiguration.widgets
  ).toEqual([MOCK_KPI_WIDGET]);
});

it('moves selected widget to front', () => {
  const MOCK_WIDGET = MockWidgetFactory.getKpiWidget({
    id: 'widget-1',
  });
  const MOCK_WIDGET_2 = MockWidgetFactory.getKpiWidget({
    id: 'widget-2',
    z: MOCK_WIDGET.z - 1, // A z-index lower than `MOCK_WIDGET`'s z-index
  });

  expect(
    bringWidgetsToFront(setupDashboardState([MOCK_WIDGET, MOCK_WIDGET_2], [MOCK_WIDGET_2])).dashboardConfiguration
      .widgets
  ).toEqual(
    expect.arrayContaining([
      MOCK_WIDGET,
      expect.objectContaining({
        z: MOCK_WIDGET.z + 1,
      }),
    ])
  );
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

  expect(
    bringWidgetsToFront(
      setupDashboardState([MOCK_WIDGET, MOCK_WIDGET_2, MOCK_WIDGET_3], [MOCK_WIDGET_2, MOCK_WIDGET_3])
    ).dashboardConfiguration.widgets
  ).toEqual(
    expect.arrayContaining([
      MOCK_WIDGET,
      expect.objectContaining({
        z: MOCK_WIDGET.z + 2,
      }),
      expect.objectContaining({
        z: MOCK_WIDGET.z + 1,
      }),
    ])
  );
});
