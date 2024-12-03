import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import { type IoTSiteWiseDataStreamQuery } from '../../../types';
import { isDefined } from '../../../util/isDefined';
import type { QueryWidget } from '../types';
import { colorerFromStyleSettings } from './assetQuery/defaultColors';
import { getCurrentAggregationResolution } from './widgetAggregationUtils';

type Query = NonNullable<QueryWidget['properties']['queryConfig']['query']>;

// Assigns default RefID to each property and defauly aggregations+resolutions to each property
const assignDefaults = (
  {
    assets = [],
    properties = [],
    assetModels = [],
    alarms = [],
    alarmModels = [],
  }: IoTSiteWiseDataStreamQuery,
  resAndAggr: { aggregation?: AggregateType; resolution?: string },
  getId: () => string = uuid
) => ({
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
});

const assignDefaultColors = (
  styleSettings: StyleSettingsMap,
  siteWiseQuery: Query
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

export const assignDefaultStyles = (widget: QueryWidget): QueryWidget => {
  const siteWiseAssetQuery = widget.properties.queryConfig.query;

  if (!siteWiseAssetQuery) return widget;

  let styleSettings = widget.properties.styleSettings || {};

  const defaultResolutionAndAggregation =
    getCurrentAggregationResolution(widget);
  const assetQueriesWithRefIds = assignDefaults(
    siteWiseAssetQuery,
    defaultResolutionAndAggregation
  );
  styleSettings = assignDefaultColors(styleSettings, assetQueriesWithRefIds);

  const updated = {
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

  return updated;
};
