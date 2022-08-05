import { MOCK_EMPTY_DASHBOARD, MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET } from '../../testing/mocks';
import { DashboardConfiguration } from '../../types';
import { reversePaste } from './reversePaste';
import { DashboardActionType } from '../actions';

const dashboardConfig: DashboardConfiguration = {
  widgets: [MOCK_KPI_WIDGET],
  viewport: { duration: '5m' },
};

it('returns delete action for most recently created widget', () => {
  expect(
    reversePaste({
      dashboardConfiguration: dashboardConfig,
      copyGroup: [MOCK_KPI_WIDGET],
    })
  ).toEqual({
    payload: { widgets: [MOCK_KPI_WIDGET] },
    type: DashboardActionType.DELETE,
  });
});

it('returns delete action for group of widgets', () => {
  expect(
    reversePaste({
      dashboardConfiguration: { widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET], viewport: { duration: '5m' } },
      copyGroup: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
    })
  ).toEqual({
    payload: {
      widgets: [MOCK_LINE_CHART_WIDGET, MOCK_KPI_WIDGET],
    },
    type: DashboardActionType.DELETE,
  });
});

it('returns empty delete action when dashboard configuration is empty', () => {
  expect(
    reversePaste({
      dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
      copyGroup: [],
    })
  ).toEqual({
    payload: { widgets: [] },
    type: DashboardActionType.DELETE,
  });
});
