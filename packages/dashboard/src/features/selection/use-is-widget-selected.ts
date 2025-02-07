import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';

export interface UseIsWidgetSelectedOptions {
  widgetId: string;
}

export type UseIsWidgetSelectResult = boolean;

/**
 * Use to determine if a widget instance is currently selected.
 */
export function useIsWidgetSelected({
  widgetId,
}: UseIsWidgetSelectedOptions): UseIsWidgetSelectResult {
  return useSelector((state: DashboardState) =>
    Boolean(state.selectedWidgets.find((widget) => widget.id === widgetId))
  );
}
