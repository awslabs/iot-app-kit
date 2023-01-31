import { combineProviders, TimeQuery, TimeSeriesDataRequest, TimeSeriesDataRequestSettings } from "@iot-app-kit/core";
import { MinimalViewPortConfig, TimeSeriesData } from "./dataTypes";

/**
 * Create a provider
 */
export const buildProvider = (
    queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[],
    settings: TimeSeriesDataRequestSettings,
    viewport: MinimalViewPortConfig,
    widgetId: string
  ) => {
  console.info('build', queries)

  const DEFAULT_SETTINGS: TimeSeriesDataRequestSettings = {
    resolution: '0',
    fetchMostRecentBeforeEnd: true,
  };

  return combineProviders(
    queries.map((query) =>
      query.build(widgetId, {
        viewport: viewport,
        settings: {
          ...DEFAULT_SETTINGS,
          ...settings,
        },
      })
    )
  );
};
