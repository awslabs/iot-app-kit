import { MOCK_KPI_WIDGET } from '../../testing/mocks';
import { DashboardConfiguration, onCreateAction } from '../../types';
import { reverseCreate } from './reverseCreate';
const dashboardConfig: DashboardConfiguration = {
  widgets: [MOCK_KPI_WIDGET],
  viewport: { duration: '5m' },
};

it('returns a delete action for the specified widget', () => {
  expect(
    reverseCreate(
      onCreateAction({
        widgets: [MOCK_KPI_WIDGET],
        dashboardConfiguration: dashboardConfig,
      })
    )
  ).toEqual({
    payload: { widgets: [MOCK_KPI_WIDGET], widgetIds: [MOCK_KPI_WIDGET.id] },
    type: 'DELETE',
  });
});
