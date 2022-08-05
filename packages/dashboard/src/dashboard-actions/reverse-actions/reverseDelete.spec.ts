import { MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET } from '../../testing/mocks';
import { onDeleteAction, DeleteAction } from '../../dashboard-actions/actions';
import { reverseDelete } from './reverseDelete';
import { DashboardActionType } from '../actions';

it('returns a delete action for the specified widget', () => {
  const deleteAction: DeleteAction = onDeleteAction({
    widgets: [MOCK_KPI_WIDGET],
  });
  expect(reverseDelete(deleteAction)).toEqual({
    payload: { widgets: [MOCK_KPI_WIDGET] },
    type: DashboardActionType.CREATE,
  });
});

it('returns a delete action for multiple widgets', () => {
  const deleteAction: DeleteAction = onDeleteAction({
    widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
  });
  expect(reverseDelete(deleteAction)).toEqual({
    payload: { widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET] },
    type: DashboardActionType.CREATE,
  });
});
