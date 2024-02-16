import {
  DescribeAssetCommand,
  type AssetCompositeModel,
  type AssetProperty,
  type DescribeAssetResponse,
  type IoTSiteWiseClient,
  type DescribeAssetCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import type {
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useClients } from '~/components/dashboard/clientContext';
import {
  createFetchSiteWiseAssetQueryDescription,
  createListAssetPropertiesMapCacheKey,
} from '~/data/listAssetPropertiesMap/query';
import { selectListAssetPropertiesMap } from '~/data/listAssetPropertiesMap/selectData';
import { DashboardState } from '~/store/state';

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

const createAssetDescriptionMapQuery = (
  iotSiteWiseClient: IoTSiteWiseClient | undefined,
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
) => {
  const queryKey: string[] = [
    ...ASSET_DESCRIPTION_QUERY_KEY,
    'assetDescriptionsMap',
    ...(siteWiseQuery?.assets?.map(
      ({ assetId }: { assetId: string }) => assetId
    ) ?? []),
  ];

  const fetchSiteWiseAssetQueryDescription = async () => {
    if (!iotSiteWiseClient || !siteWiseQuery) return [];
    return describeSiteWiseAssetQuery(iotSiteWiseClient, siteWiseQuery);
  };

  const query = {
    queryKey,
    queryFn: () => fetchSiteWiseAssetQueryDescription(),
    select: (data: DescribeAssetCommandOutput[]) =>
      data?.reduce<Record<string, AssetSummary>>((acc, n) => {
        const { assetId } = n;
        if (assetId) {
          acc[assetId] = mapAssetDescriptionToAssetSummary(n);
        }
        return acc;
      }, {}) ?? {},
  };

  return query;
};

export const useAssetDescriptionMapQuery = (
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
) => {
  const { iotSiteWiseClient } = useClients();

  const query = createAssetDescriptionMapQuery(
    iotSiteWiseClient,
    siteWiseQuery
  );

  return useQuery(query);
};

const createListAssetPropertiesMapQuery = (
  iotSiteWiseClient: IoTSiteWiseClient | undefined,
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
) => {
  const queryKey = createListAssetPropertiesMapCacheKey(siteWiseQuery);
  const queryFn = createFetchSiteWiseAssetQueryDescription(
    iotSiteWiseClient,
    siteWiseQuery
  );

  const query = {
    queryKey,
    queryFn,
    select: selectListAssetPropertiesMap,
  };

  return query;
};

export const useListAssetPropertiesMapQuery = (
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
) => {
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );

  const { iotSiteWiseClient } = useClients();

  const query = isEdgeModeEnabled
    ? createAssetDescriptionMapQuery(iotSiteWiseClient, siteWiseQuery)
    : createListAssetPropertiesMapQuery(iotSiteWiseClient, siteWiseQuery);

  const queryKey = query.queryKey;
  const queryFn: () => Promise<unknown[]> = query.queryFn;
  /*
   * FIXME: Eliminated typecasting
   * Casting `select` to a common type to overcome generic type entanglement in useQuery()
   * `select` from both query options are returning a common type but inputs are different
   */
  const select = query.select as (
    data: unknown
  ) => Record<string, AssetSummary>;

  return useQuery({
    queryKey,
    queryFn,
    select,
  });
};
