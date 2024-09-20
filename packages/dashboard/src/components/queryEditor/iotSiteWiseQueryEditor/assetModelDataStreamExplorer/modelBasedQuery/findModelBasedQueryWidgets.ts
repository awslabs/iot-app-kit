import { QueryProperties } from '~/customization/widgets/types';
import { DashboardState } from '~/store/state';
import { DashboardWidget } from '~/types';

export type QueryConfigWidget = DashboardWidget<QueryProperties>;
export const isQueryWidget = (w: DashboardWidget): w is QueryConfigWidget =>
  'queryConfig' in w.properties;

export const findModelBasedQueryWidgets = (
  dashboardConfiguration: DashboardState['dashboardConfiguration']
) =>
  dashboardConfiguration.widgets
    .filter(isQueryWidget)
    .filter(
      (w) =>
        (w.properties.queryConfig.query?.assetModels ?? []).length > 0 ||
        (w.properties.queryConfig.query?.alarmModels ?? []).length > 0
    );

export const hasModelBasedQuery = (
  dashboardConfiguration: DashboardState['dashboardConfiguration']
) => findModelBasedQueryWidgets(dashboardConfiguration).length > 0;
