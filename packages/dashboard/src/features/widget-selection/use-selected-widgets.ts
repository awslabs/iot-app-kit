import { createNonNullableList } from '~/helpers/lists';
import { createStoreSelector, useStoreSelector } from '~/store';

const selectSelectedWidgets = createStoreSelector(
  [
    (state) => state.selection.selectedWidgetIds,
    (state) => state.dashboard.present.dashboardConfiguration.widgets,
  ],
  (selectedWidgetIds, widgets) =>
    createNonNullableList(
      selectedWidgetIds.map((id) => widgets.find((widget) => widget.id === id))
    )
);

export function useSelectedWidgets() {
  return useStoreSelector(selectSelectedWidgets);
}
