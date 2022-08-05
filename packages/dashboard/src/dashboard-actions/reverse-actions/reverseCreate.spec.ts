import { MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET } from '../../testing/mocks';
import { onCreateAction } from '../actions';
import { reverseCreate } from './reverseCreate';
import { DashboardActionType } from '../actions';

it('returns a delete action for the specified widget', () => {
  expect(
    reverseCreate(
      onCreateAction({
        widgets: [MOCK_KPI_WIDGET],
      })
    )
  ).toEqual({
    payload: { widgets: [MOCK_KPI_WIDGET] },
    type: DashboardActionType.DELETE,
  });
});

it('returns a delete action for multiple widgets', () => {
  expect(
    reverseCreate(
      onCreateAction({
        widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
      })
    )
  ).toEqual({
    payload: {
      widgets: [MOCK_KPI_WIDGET, MOCK_LINE_CHART_WIDGET],
    },
    type: DashboardActionType.DELETE,
  });
});

it('returns a delete action with empty arrays in payload when no widgets provided', () => {
  expect(
    reverseCreate(
      onCreateAction({
        widgets: [],
      })
    )
  ).toEqual({
    payload: { widgets: [] },
    type: DashboardActionType.DELETE,
  });
});
