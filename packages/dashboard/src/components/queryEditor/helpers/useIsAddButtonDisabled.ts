import { useQuery } from '../iotSiteWiseQueryEditor/useQuery/useQuery';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export const useIsAddButtonDisabled = (selectedWidgets: WidgetInstance[]) => {
  const selectedWidget = selectedWidgets.at(0);
  const [query, _useQuery] = useQuery();

  if (!selectedWidget) return true;

  if (selectedWidget.type === 'kpi' || selectedWidget.type === 'gauge') {
    if (
      query?.assetModels?.length ||
      query?.assets?.length ||
      query?.properties?.length ||
      query?.alarms?.length ||
      query?.alarmModels?.length
    )
      return true;
  }

  return false;
};
