import { paste } from './paste';
import { MOCK_EMPTY_DASHBOARD, MOCK_KPI_WIDGET, MockWidgetFactory, MockDashboardFactory } from '../testing/mocks';

it('returns empty dashboard when pasting on an empty dashboard with nothing in the copy group', () => {
  expect(
    paste({
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
      copyGroup: [],
      numTimesCopyGroupHasBeenPasted: 0,
      cellSize: 10,
    })
  ).toEqual(MOCK_EMPTY_DASHBOARD);
});

it('paste single widget', () => {
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] });
  expect(
    paste({
      dashboardConfiguration,
      copyGroup: [MOCK_KPI_WIDGET],
      numTimesCopyGroupHasBeenPasted: 0,
      cellSize: 10,
    })
  ).toEqual({
    ...dashboardConfiguration,
    widgets: [
      MOCK_KPI_WIDGET,
      { ...MOCK_KPI_WIDGET, id: expect.any(String), x: MOCK_KPI_WIDGET.x + 1, y: MOCK_KPI_WIDGET.y + 1 },
    ],
  });
});

it('paste single widget a second time, shifts the position down', () => {
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] });
  expect(
    paste({
      dashboardConfiguration,
      copyGroup: [MOCK_KPI_WIDGET],
      numTimesCopyGroupHasBeenPasted: 2,
      cellSize: 10,
    })
  ).toEqual({
    ...dashboardConfiguration,
    widgets: [
      MOCK_KPI_WIDGET,
      { ...MOCK_KPI_WIDGET, id: expect.any(String), x: MOCK_KPI_WIDGET.x + 3, y: MOCK_KPI_WIDGET.y + 3 },
    ],
  });
});

it('paste multiple widgets', () => {
  const WIDGET_A = MockWidgetFactory.getKpiWidget({ id: 'widget-1', x: 2, y: 2 });
  const WIDGET_B = MockWidgetFactory.getKpiWidget({ id: 'widget-2', x: 20, y: 20 });
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A, WIDGET_B] });
  expect(
    paste({
      dashboardConfiguration,
      copyGroup: [WIDGET_A, WIDGET_B],
      numTimesCopyGroupHasBeenPasted: 0,
      cellSize: 10,
    })
  ).toEqual({
    ...dashboardConfiguration,
    widgets: [
      WIDGET_A,
      WIDGET_B,
      { ...WIDGET_A, id: expect.any(String), x: WIDGET_A.x + 1, y: WIDGET_A.y + 1 },
      { ...WIDGET_B, id: expect.any(String), x: WIDGET_B.x + 1, y: WIDGET_B.y + 1 },
    ],
  });
});

it('pastes a widget at a specific location', () => {
  const WIDGET_A = MockWidgetFactory.getKpiWidget({ id: 'widget-1', x: 2, y: 2 });
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [WIDGET_A] });
  expect(
    paste({
      dashboardConfiguration,
      copyGroup: [WIDGET_A],
      numTimesCopyGroupHasBeenPasted: 0,
      cellSize: 10,
      position: { x: 5, y: 5 },
    })
  ).toEqual({
    ...dashboardConfiguration,
    widgets: [WIDGET_A, { ...WIDGET_A, id: expect.any(String), x: 1, y: 1 }],
  });
});
