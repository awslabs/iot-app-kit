import { DashboardWidget } from '~/types';
import { useQuery } from '../useQuery';

export const useIsAddButtonDisabled = (selectedWidgets: DashboardWidget[]) => {
  const selectedWidget = selectedWidgets.at(0);
  const [query, _useQuery] = useQuery();

  if (!selectedWidget || !query) return false;

  if (selectedWidget.type === 'kpi' || selectedWidget.type === 'gauge') {
    if (
      query.assetModels?.length ||
      query.assets?.length ||
      query.properties?.length
    )
      return true;
  }

  return selectedWidgets.length === 0;
};
