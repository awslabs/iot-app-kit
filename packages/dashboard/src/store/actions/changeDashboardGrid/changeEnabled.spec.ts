import { initialState } from '../../state';
import { changeDashboardGridDragEnabled, onChangeDashboardGridEnabledAction } from './changeEnabled';
import { MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';

it('can change grid enabled', () => {
  const store = {
    ...initialState,
    dashboardConfiguration: {
      ...initialState.dashboardConfiguration,
      widgets: [{ ...MOCK_LINE_CHART_WIDGET }],
    },
    selectedWidgets: [{ ...MOCK_LINE_CHART_WIDGET }],
  };

  const gridEnabled = [false, true];

  gridEnabled.forEach((enabled) => {
    const updatedStore = changeDashboardGridDragEnabled(
      store,
      onChangeDashboardGridEnabledAction({
        enabled: enabled,
      })
    );
    expect(updatedStore.grid.enabled).toEqual(enabled);
    expect(updatedStore.selectedWidgets[0].height).toEqual(MOCK_LINE_CHART_WIDGET.height);
    expect(updatedStore.selectedWidgets[0].width).toEqual(MOCK_LINE_CHART_WIDGET.width);
  });
});
