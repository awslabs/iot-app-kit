import type {
  IoTSiteWiseDataStreamQuery,
  SiteWiseQueryConfig,
} from '~/features/queries/queries';
import type { AggregateType } from '@aws-sdk/client-iotsitewise';
import { v4 as uuid } from 'uuid';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import { isDefined } from '~/util/isDefined';
import type { WidgetInstance } from '~/features/widget-instance/instance';
import { isQueryWidgetInstance } from '~/components/queryEditor/iotSiteWiseQueryEditor/useQuery/findModelBasedQueryWidgets';
import { Colorizer } from '@iot-app-kit/core-util';
import { compact } from '~/helpers/lists/compact';
import type {
  Resolution,
  SiteWiseDataStreamQuery,
} from '@iot-app-kit/source-iotsitewise';
import type { RegisteredWidgetType } from '~/features/widget-plugins/registry';
import type { StyledAssetQuery } from '~/plugins/xy-plot/types';
import uniq from 'lodash-es/uniq';

export const applyDefaultStylesToQuery = ({
  assets = [],
  properties = [],
  assetModels = [],
  alarms = [],
  alarmModels = [],
}: StyledAssetQuery) => {
  const assignDefaultColor = colorerFromStyledQuery({
    assets,
    assetModels,
    properties,
  });

  return {
    assets: assets.map(({ properties, ...others }) => ({
      ...others,
      properties: properties.map((propertyQuery) =>
        assignDefaultColor(propertyQuery)
      ),
    })),
    properties: properties.map((property) => assignDefaultColor(property)),
    assetModels: assetModels.map(({ properties, ...others }) => ({
      ...others,
      properties: properties.map((propertyQuery) =>
        assignDefaultColor(propertyQuery)
      ),
    })),
    alarms,
    alarmModels,
  };
};

const colorsFromProperties = ({
  properties,
}: {
  properties: { color?: string }[];
}) => compact(properties.map(({ color }) => color));

const applyDefault =
  (colorizer: ReturnType<typeof Colorizer>) =>
  <T extends { color?: string }>(item: T) => {
    if (item.color != null) return item;
    return colorizer.nextApply(item);
  };

export const colorerFromStyledQuery = (query: StyledAssetQuery) => {
  const assets = query.assets ?? [];
  const assetModels = query.assetModels ?? [];
  const properties = query.properties ?? [];

  const assetsColors = assets.flatMap(colorsFromProperties);
  const assetModelsColors = assetModels.flatMap(colorsFromProperties);
  const propertiesColors = colorsFromProperties({ properties });

  const existingColors = uniq([
    ...assetsColors,
    ...assetModelsColors,
    ...propertiesColors,
  ]);

  const colorer = Colorizer();
  colorer.remove(existingColors);

  return applyDefault(colorer);
};

export const applyResolutionToQuery = (
  {
    assets = [],
    properties = [],
    assetModels = [],
    alarms = [],
    alarmModels = [],
    requestSettings = {},
  }: IoTSiteWiseDataStreamQuery,
  resolution: Resolution | undefined
) => ({
  assets: assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      resolution,
    })),
  })),
  properties: properties.map((propertyQuery) => ({
    ...propertyQuery,
    resolution,
  })),
  assetModels: assetModels.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      resolution,
    })),
  })),
  alarms,
  alarmModels,
  requestSettings: {
    ...requestSettings,
    resolution,
  },
});

export const applyAggregationToQuery = (
  {
    assets = [],
    properties = [],
    assetModels = [],
    alarms = [],
    alarmModels = [],
    requestSettings = {},
  }: IoTSiteWiseDataStreamQuery,
  aggregationType: AggregateType | undefined
) => ({
  assets: assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      aggregationType,
    })),
  })),
  properties: properties.map((propertyQuery) => ({
    ...propertyQuery,
    aggregationType,
  })),
  assetModels: assetModels.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      aggregationType,
    })),
  })),
  alarms,
  alarmModels,
  requestSettings: {
    ...requestSettings,
    aggregationType,
  },
});

// Assigns default RefID to each property and default aggregations+resolutions to each property
const assignDefaults = (
  {
    assets = [],
    properties = [],
    assetModels = [],
    alarms = [],
    alarmModels = [],
  }: IoTSiteWiseDataStreamQuery | undefined = {},
  resAndAggr: { aggregation?: AggregateType; resolution?: string },
  getId: () => string = uuid
): SiteWiseDataStreamQuery =>
  ({
    assets: assets.map(({ properties, ...others }) => ({
      ...others,
      properties: properties.map((propertyQuery) => ({
        ...propertyQuery,
        resolution: resAndAggr.resolution,
        aggregationType: resAndAggr.aggregation,
        refId: propertyQuery.refId || getId(),
      })),
    })),
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      refId: propertyQuery.refId || getId(),
      resolution: resAndAggr.resolution,
      aggregationType: resAndAggr.aggregation,
    })),
    assetModels: assetModels.map(({ properties, ...others }) => ({
      ...others,
      properties: properties.map((propertyQuery) => ({
        ...propertyQuery,
        resolution: resAndAggr.resolution,
        aggregationType: resAndAggr.aggregation,
        refId: propertyQuery.refId || getId(),
      })),
    })),
    alarms,
    alarmModels,
    requestSettings: {
      ...resAndAggr,
    },
  } as SiteWiseDataStreamQuery);

const assignDefaultColors = (
  styleSettings: StyleSettingsMap,
  siteWiseQuery: IoTSiteWiseDataStreamQuery
): StyleSettingsMap => {
  const assetRefIds =
    siteWiseQuery.assets
      ?.flatMap((asset) => asset.properties.map(({ refId }) => refId))
      .filter(isDefined) ?? [];
  const propertyRefIds =
    siteWiseQuery.properties?.map(({ refId }) => refId).filter(isDefined) ?? [];
  const assetModelRefIds =
    siteWiseQuery.assetModels
      ?.flatMap((asset) => asset.properties.map(({ refId }) => refId))
      .filter(isDefined) ?? [];

  const refIds = [...assetRefIds, ...propertyRefIds, ...assetModelRefIds];
  const applicableStyleSettings = Object.keys(styleSettings)
    .filter((refId) => refIds.includes(refId))
    .reduce<StyleSettingsMap>((acc, n) => {
      acc[n] = styleSettings[n];
      return acc;
    }, {});

  const assignDefaultColor = colorerFromStyleSettings(applicableStyleSettings);

  return refIds.reduce((acc: StyleSettingsMap, refId) => {
    const existing = styleSettings[refId] || {};
    acc[refId] = assignDefaultColor(existing);
    return acc;
  }, {});
};

export const assignDefaultStyles = <WidgetType extends RegisteredWidgetType>(
  widget: WidgetInstance<WidgetType>
): WidgetInstance<WidgetType> => {
  if (!isQueryWidgetInstance(widget)) {
    return widget;
  }

  const siteWiseAssetQuery = widget.properties.queryConfig?.query as
    | IoTSiteWiseDataStreamQuery
    | undefined;

  let styleSettings =
    'styleSettings' in widget.properties &&
    widget.properties.styleSettings != null
      ? widget.properties.styleSettings
      : {};

  const defaultResolutionAndAggregation =
    getCurrentAggregationResolution(widget);
  const assetQueriesWithRefIds = assignDefaults(
    siteWiseAssetQuery,
    defaultResolutionAndAggregation
  ) as SiteWiseDataStreamQuery;
  styleSettings = assignDefaultColors(styleSettings, assetQueriesWithRefIds);

  return {
    ...widget,
    properties: {
      ...widget.properties,
      queryConfig: {
        ...widget.properties.queryConfig,
        query: assetQueriesWithRefIds,
      },
      styleSettings,
    },
  };
};

export const colorerFromStyleSettings = (styleSettings: StyleSettingsMap) => {
  const existingColors = compact(
    Object.values(styleSettings).map(({ color }) => color)
  );

  const colorer = Colorizer();
  colorer.remove(existingColors);

  return applyDefault(colorer);
};

export const getAggregation = (widget: WidgetInstance) => {
  if ('aggregationType' in widget.properties) {
    return widget.properties.aggregationType;
  }

  if (isQueryWidgetInstance(widget)) {
    if (
      widget.properties.queryConfig?.query != null &&
      widget.properties.queryConfig?.query.requestSettings != null &&
      'aggregationType' in widget.properties.queryConfig.query.requestSettings
    ) {
      return widget.properties.queryConfig.query.requestSettings
        .aggregationType;
    }

    const firstProperty = getFirstProperty(widget.properties.queryConfig);

    return firstProperty?.aggregationType;
  }
};

function getFirstProperty(queryConfig?: SiteWiseQueryConfig) {
  if (!queryConfig || !('query' in queryConfig) || queryConfig.query == null)
    return undefined;

  if (
    'properties' in queryConfig.query &&
    queryConfig.query.properties != null &&
    queryConfig.query.properties.length > 0
  ) {
    return queryConfig.query.properties[0];
  }

  if (
    'assets' in queryConfig.query &&
    queryConfig.query.assets != null &&
    queryConfig.query.assets.length > 0
  ) {
    return queryConfig.query.assets[0].properties[0];
  }

  if (
    'assetModels' in queryConfig.query &&
    queryConfig.query.assetModels != null &&
    queryConfig.query.assetModels.length > 0
  ) {
    return queryConfig.query.assetModels[0].properties[0];
  }
}

export const WidgetDefaultResolution: Record<string, string | undefined> = {
  'bar-chart': '1m',
  'line-chart': '1m',
  'xy-plot': '1m',
  'scatter-chart': '1m',
  'status-timeline': '0',
  kpi: '0',
  status: '0',
  table: '0',
  gauge: '0',
};

export const getCurrentAggregationResolution = (widget: WidgetInstance) => {
  if (
    'aggregationType' in widget.properties &&
    'resolution' in widget.properties
  ) {
    return {
      aggregation: widget.properties.aggregationType as
        | AggregateType
        | undefined,
      resolution: widget.properties.resolution as Resolution | undefined,
    };
  }

  const widgetType = widget.type;
  const firstAssetProperty = isQueryWidgetInstance(widget)
    ? getFirstProperty(widget.properties.queryConfig)
    : undefined;
  const currentAggregation =
    firstAssetProperty?.aggregationType ?? WidgetDefaultResolution[widgetType];
  const currentResolution =
    firstAssetProperty?.resolution ?? WidgetDefaultResolution[widgetType];

  return {
    aggregation: currentAggregation as AggregateType | undefined,
    resolution: currentResolution as Resolution | undefined,
  };
};

export const assignDefaultRefId = (
  {
    assets = [],
    properties = [],
    assetModels = [],
    alarms = [],
    alarmModels = [],
  }: IoTSiteWiseDataStreamQuery,
  getId: () => string = uuid
) => ({
  assets: assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      refId: propertyQuery.refId || getId(),
    })),
  })),
  properties: properties.map((propertyQuery) => ({
    ...propertyQuery,
    refId: propertyQuery.refId || getId(),
  })),
  assetModels: assetModels.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      refId: propertyQuery.refId || getId(),
    })),
  })),
  alarms,
  alarmModels,
});
