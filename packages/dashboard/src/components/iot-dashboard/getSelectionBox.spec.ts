import { MOCK_EMPTY_DASHBOARD, MOCK_KPI_WIDGET, MockWidgetFactory, MockDashboardFactory } from '../../testing/mocks';
import { getSelectionBox } from './getSelectionBox';

it('returns no rectangle if no widgets on the dashboard', () => {
  expect(
    getSelectionBox({
      selectedWidgetIds: ['fake'],
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
    })
  ).toBe(null);
});

it('returns no rectangle if no widgets are selected', () => {
  expect(
    getSelectionBox({
      selectedWidgetIds: [],
      dashboardConfiguration: MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] }),
    })
  ).toBe(null);
});

it('returns exact dimensions of selected widget if only one widget is selected', () => {
  expect(
    getSelectionBox({
      selectedWidgetIds: ['some-widget'],
      dashboardConfiguration: MockDashboardFactory.get({
        widgets: [
          MockWidgetFactory.getKpiWidget({
            id: 'some-widget',
            x: 0,
            y: 0,
            height: 10,
            width: 10,
          }),
        ],
      }),
    })
  ).toEqual({
    x: 0,
    y: 0,
    width: 10,
    height: 10,
  });
});

it('returns rectangle that contains multiple rectangles', () => {
  const MOCK_WIDGET = MockWidgetFactory.getKpiWidget({
    id: 'some-widget',
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  });
  const MOCK_WIDGET_2 = MockWidgetFactory.getKpiWidget({
    id: 'some-widget-2',
    x: 100,
    y: 100,
    height: 10,
    width: 10,
  });
  const dashboardConfiguration = MockDashboardFactory.get({ widgets: [MOCK_WIDGET, MOCK_WIDGET_2] });

  expect(
    getSelectionBox({
      selectedWidgetIds: ['some-widget', 'some-widget-2'],
      dashboardConfiguration,
    })
  ).toEqual({
    x: 0,
    y: 0,
    width: 110,
    height: 110,
  });
});
