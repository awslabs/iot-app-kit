import { MOCK_KPI_WIDGET } from '../../testing/mocks';
import { DashboardConfiguration } from '../../types';
import { reversePaste } from './reversePaste';
const dashboardConfig: DashboardConfiguration = {
  widgets: [MOCK_KPI_WIDGET],
  viewport: { duration: '5m' },
};

it('returns delete action for most recently created widget', () => {
  expect(reversePaste(dashboardConfig)).toEqual({
    payload: { widgets: [MOCK_KPI_WIDGET], widgetIds: [MOCK_KPI_WIDGET.id] },
    type: 'DELETE',
  });
});

it('returns empty delete action when dashboard configuration is empty', () => {
  expect(reversePaste(dashboardConfig)).toEqual({
    payload: { widgets: [], widgetIds: [] },
    type: 'DELETE',
  });
});
