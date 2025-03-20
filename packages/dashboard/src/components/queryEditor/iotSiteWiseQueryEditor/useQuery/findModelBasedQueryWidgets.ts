import { type WidgetInstance } from '~/features/widget-instance/instance';
import { type SiteWiseQueryConfig } from '~/features/queries/queries';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export type QueryWidgetInstance<
  WidgetType extends RegisteredWidgetType = RegisteredWidgetType
> = Extract<
  WidgetInstance<WidgetType>,
  {
    properties: { queryConfig?: SiteWiseQueryConfig };
  }
>;

export function isQueryWidgetInstance<
  const WidgetType extends RegisteredWidgetType
>(
  widget: WidgetInstance<WidgetType>
): widget is QueryWidgetInstance<WidgetType> {
  return 'queryConfig' in widget.properties;
}

export const findModelBasedQueryWidgets = (
  widgets: WidgetInstance[]
): QueryWidgetInstance[] =>
  widgets
    .filter(isQueryWidgetInstance)
    .filter(
      (w) =>
        (w.properties.queryConfig?.query?.assetModels ?? []).length > 0 ||
        (w.properties.queryConfig?.query?.alarmModels ?? []).length > 0
    );

export const hasModelBasedQuery = (widgets: WidgetInstance[]) =>
  findModelBasedQueryWidgets(widgets).length > 0;
