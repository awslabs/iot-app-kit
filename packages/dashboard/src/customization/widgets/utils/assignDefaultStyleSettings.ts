import { StyleSettingsMap } from '@iot-app-kit/core';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { colorPalette } from '~/util/colorPalette';
import { QueryWidget } from '../types';

const assignDefaultRefId = (siteWiseAssetQuery: SiteWiseAssetQuery) => ({
  assets: siteWiseAssetQuery.assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      refId: propertyQuery.refId || propertyQuery.propertyId,
    })),
  })),
});

const assignDefaultColors = (
  styleSettings: StyleSettingsMap,
  siteWiseAssetQuery: SiteWiseAssetQuery,
  colorIndexOffset = 0
): StyleSettingsMap =>
  siteWiseAssetQuery.assets.reduce((acc, n) => {
    n.properties.forEach(({ refId }, index) => {
      if (refId && !styleSettings[refId]) {
        acc[refId] = {
          color: colorPalette[index + (colorIndexOffset % colorPalette.length)],
        };
      }
    });
    return acc;
  }, {} as StyleSettingsMap);

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
