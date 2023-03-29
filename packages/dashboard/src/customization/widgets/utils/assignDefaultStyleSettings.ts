import type { StyleSettingsMap } from '@iot-app-kit/core';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { v4 as uuid } from 'uuid';
import type { QueryWidget } from '../types';
import { assignDefaultColor } from '@iot-app-kit/core-util';

const assignDefaultRefId = (siteWiseAssetQuery: SiteWiseAssetQuery, getId: () => string = uuid) => ({
  assets: siteWiseAssetQuery.assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      refId: propertyQuery.refId || getId(),
    })),
  })),
});

const assignDefaultColors = (
  styleSettings: StyleSettingsMap,
  siteWiseAssetQuery: SiteWiseAssetQuery,
  colorIndexOffset = 0
): StyleSettingsMap => {
  const properties = siteWiseAssetQuery.assets.flatMap((asset) =>
    asset.properties.map(({ refId }) => ({
      refId,
    }))
  );

  return properties.reduce((acc: StyleSettingsMap, { refId }, index) => {
    if (refId && !styleSettings[refId]) {
      acc[refId] = assignDefaultColor({}, index + colorIndexOffset);
    }
    return acc;
  }, {});
};

export const assignDefaultStyles = (widget: QueryWidget): QueryWidget => {
  const siteWiseAssetQuery = widget.properties.queryConfig.query;

  if (!siteWiseAssetQuery) return widget;

  let styleSettings = {};

  const assetQueriesWithRefIds = assignDefaultRefId(siteWiseAssetQuery);
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
