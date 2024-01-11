import {
  DescribeAssetCommand,
  type AssetCompositeModel,
  type AssetProperty,
  type DescribeAssetResponse,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import type {
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import { useQuery } from '@tanstack/react-query';
import { useClients } from '~/components/dashboard/clientContext';
import {
  createFetchSiteWiseAssetQueryDescription,
  createListAssetPropertiesMapCacheKey,
} from '~/data/listAssetPropertiesMap/query';
import { selectListAssetPropertiesMap } from '~/data/listAssetPropertiesMap/selectData';

export type PropertySummary = {
  propertyId: AssetProperty['id'];
  name: AssetProperty['name'];
  unit: AssetProperty['unit'];
  dataType: AssetProperty['dataType'];
  alias: AssetProperty['alias'];
};

export type AlarmSummary = {
  name: AssetCompositeModel['name'];
  id: AssetCompositeModel['id'];
  properties: PropertySummary[];
};

export type AssetSummary = {
  assetId: DescribeAssetResponse['assetId'];
  assetName: DescribeAssetResponse['assetName'];
  properties: PropertySummary[];
  alarms: AlarmSummary[];
};

const describeAsset = (client: IoTSiteWiseClient, assetId: string) =>
  client.send(new DescribeAssetCommand({ assetId }));

const describeSiteWiseAssetQuery = async (
  client: IoTSiteWiseClient,
  siteWiseQuery: Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
) =>
  Promise.all(
    siteWiseQuery.assets?.map(({ assetId }: { assetId: string }) =>
      describeAsset(client, assetId)
    ) ?? []
  );

const ASSET_DESCRIPTION_QUERY_KEY = ['assetDescriptions'];

export const isAlarm = (item: AssetCompositeModel) => item.type === 'AWS/ALARM';

export const isAlarmState = (property: AssetProperty) =>
  property.name === 'AWS/ALARM_STATE';

const mapPropertySummary = ({
  id,
  name,
  unit,
  dataType,
  alias,
}: AssetProperty): PropertySummary => ({
  propertyId: id,
  name,
  unit,
  dataType,
  alias,
});

const mapCompositeModelToAlarmSummary = (
  model: AssetCompositeModel
): AlarmSummary => ({
  name: model.name,
  id: model?.id,
  properties:
    model.properties
      ?.filter(isAlarmState)
      .map(({ id, unit, dataType, alias }) =>
        mapPropertySummary({ id, unit, dataType, alias, name: model.name })
      ) ?? [],
});

export const mapAssetDescriptionToAssetSummary = (
  description: DescribeAssetResponse
): AssetSummary => ({
  assetId: description.assetId,
  assetName: description.assetName,
  properties: description.assetProperties?.map(mapPropertySummary) ?? [],
  alarms:
    description.assetCompositeModels
      ?.filter(isAlarm)
      .map(mapCompositeModelToAlarmSummary) ?? [],
});

export const useAssetDescriptionMapQuery = (
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
) => {
  const { iotSiteWiseClient } = useClients();

  const fetchSiteWiseAssetQueryDescription = async () => {
    if (!iotSiteWiseClient || !siteWiseQuery) return [];
    return describeSiteWiseAssetQuery(iotSiteWiseClient, siteWiseQuery);
  };

  return useQuery({
    queryKey: [
      ...ASSET_DESCRIPTION_QUERY_KEY,
      'assetDescriptionsMap',
      ...(siteWiseQuery?.assets?.map((a) => a.assetId) ?? []),
    ],
    queryFn: () => fetchSiteWiseAssetQueryDescription(),
    select: (data) =>
      data?.reduce<Record<string, AssetSummary>>((acc, n) => {
        const { assetId } = n;
        if (assetId) {
          acc[assetId] = mapAssetDescriptionToAssetSummary(n);
        }
        return acc;
      }, {}) ?? {},
  });
};

export const useListAssetPropertiesMapQuery = (
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
) => {
  const { iotSiteWiseClient } = useClients();
  const queryKey = createListAssetPropertiesMapCacheKey(siteWiseQuery);
  const queryFn = createFetchSiteWiseAssetQueryDescription(
    iotSiteWiseClient,
    siteWiseQuery
  );

  return useQuery({
    queryKey,
    queryFn,
    select: selectListAssetPropertiesMap,
  });
};
