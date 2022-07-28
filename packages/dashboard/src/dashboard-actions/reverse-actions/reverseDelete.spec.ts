import { MOCK_KPI_WIDGET } from '../../testing/mocks';
import { DashboardConfiguration, onDeleteAction, DeleteAction } from '../../types';
import { reverseDelete } from './reverseDelete';
const dashboardConfig: DashboardConfiguration = {
  widgets: [MOCK_KPI_WIDGET],
  viewport: { duration: '5m' },
};

it('returns a delete action fro the specified widget', () => {
  const deleteAction: DeleteAction = onDeleteAction({
    widgetIds: [MOCK_KPI_WIDGET.id],
    widgets: [MOCK_KPI_WIDGET],
  });
  expect(reverseDelete(deleteAction, dashboardConfig)).toEqual({
    payload: { widgets: [MOCK_KPI_WIDGET], dashboardConfiguration: dashboardConfig },
    type: 'CREATE',
  });
});
