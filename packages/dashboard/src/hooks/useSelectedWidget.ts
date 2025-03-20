import isEqual from 'lodash-es/isEqual';
import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { type DashboardWidget } from '~/types';

export const useSelectedWidgetIds = <
  Properties extends Record<string, unknown> = Record<string, unknown>
>(): readonly string[] => {
  return useSelector(
    (state: DashboardState<Properties>) => state.selectedWidgetIds
  );
};

export function useSelectedWidgets() {
  return useSelector((state: DashboardState) => {
    return getWidgets(
      state.selectedWidgetIds,
      state.dashboardConfiguration.widgets
    );
  }, isEqual);
}

export function getWidgets(
  widgetIds: readonly string[],
  widgets: readonly DashboardWidget[]
) {
  return widgetIds.map((widgetId) => getWidget(widgetId, widgets));
}

export function getWidget(
  widgetId: string,
  widgets: readonly DashboardWidget[]
) {
  const widget = widgets.find(({ id }) => id === widgetId);

  if (!widget) {
    throw Error('Expected selected widget to exist.');
  }

  return widget;
}
