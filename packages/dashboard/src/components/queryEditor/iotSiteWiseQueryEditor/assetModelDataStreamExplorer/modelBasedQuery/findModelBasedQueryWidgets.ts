import { type WidgetInstance } from '~/features/widget-instance/instance';

export const findModelBasedQueryWidgets = (widgets: WidgetInstance[]) =>
  widgets
    .filter((w) => 'queryConfig' in w.properties)
    .filter(
      (w) =>
        (w.properties.queryConfig?.query?.assetModels ?? []).length > 0 ||
        (w.properties.queryConfig?.query?.alarmModels ?? []).length > 0
    );

export const hasModelBasedQuery = (widgets: WidgetInstance[]) =>
  findModelBasedQueryWidgets(widgets).length > 0;
