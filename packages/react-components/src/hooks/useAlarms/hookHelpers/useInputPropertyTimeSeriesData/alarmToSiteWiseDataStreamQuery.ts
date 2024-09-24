import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseDataStreamQuery } from '@iot-app-kit/source-iotsitewise';
import { AlarmData } from '../../types';
import { createNonNullableList } from '../../../../utils/createNonNullableList';
import { IterableElement } from 'type-fest';

type Properties<PropertyId = string> = Set<PropertyId>;

type AssetQuery<AssetId = string, PropertyId = string> = Map<
  AssetId,
  Properties<PropertyId>
>;

const assetQueryFromAlarm = ({ assetId, inputProperty = [] }: AlarmData) => {
  if (assetId == null) return [];

  const properties = createNonNullableList(
    inputProperty.map(({ property: { id } }) => id)
  ).map((propertyId) => ({ propertyId }));

  if (properties.length === 0) return [];

  return [
    {
      assetId,
      properties,
    },
  ];
};

const uniqueAssetQuery = (
  assetQueryMap: AssetQuery,
  assetQuery: ReturnType<typeof assetQueryFromAlarm>
) => {
  assetQuery.forEach(({ assetId, properties }) => {
    const propertiesSet = assetQueryMap.get(assetId) ?? new Set();
    properties.forEach(({ propertyId }) => {
      propertiesSet.add(propertyId);
    });
    assetQueryMap.set(assetId, propertiesSet);
  });

  return assetQueryMap;
};

const toSiteWiseDataStreamQuery =
  ({
    aggregationType,
    resolution,
  }: {
    aggregationType: AggregateType;
    resolution?: string;
  }) =>
  (
    query: SiteWiseDataStreamQuery,
    assetQueryMapEntry: IterableElement<AssetQuery>
  ) => {
    const [assetId, propertiesSet] = assetQueryMapEntry;
    const assetQuery = {
      assetId,
      properties: [...propertiesSet.values()].map((propertyId) => ({
        propertyId,
        aggregationType,
        resolution,
      })),
    };
    return { ...query, assets: [...(query.assets ?? []), assetQuery] };
  };

export const alarmToSiteWiseDataStreamQuery = (
  alarms: AlarmData[],
  {
    aggregationType,
    resolution,
  }: { aggregationType: AggregateType; resolution?: string }
) => {
  /**
   * Get a unique list of assetIds and their
   * associated propertyIds.
   */
  const assetQueryMap = alarms
    .map(assetQueryFromAlarm)
    .reduce<AssetQuery>(uniqueAssetQuery, new Map());

  /**
   * map unique asset + properties into
   * a sitewise datastream query
   */
  const siteWiseDataStreamQuery = [
    ...assetQueryMap.entries(),
  ].reduce<SiteWiseDataStreamQuery>(
    toSiteWiseDataStreamQuery({ aggregationType, resolution }),
    { assets: [] }
  );

  return siteWiseDataStreamQuery;
};
