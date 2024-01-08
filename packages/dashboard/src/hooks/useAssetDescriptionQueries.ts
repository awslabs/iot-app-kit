import {
  DescribeAssetCommand,
  type AssetCompositeModel,
  type AssetProperty,
  type DescribeAssetResponse,
  type IoTSiteWiseClient,
  AssetPropertySummary,
  AssetModelPropertySummary,
} from '@aws-sdk/client-iotsitewise';
import type {
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import { useQuery } from '@tanstack/react-query';
import { useClients } from '~/components/dashboard/clientContext';
import { listAssetPropertiesWithComposite } from './listAssetPropertiesWithAssetDescription';

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

// new call beyond this point

const listAssetProperties = (client: IoTSiteWiseClient, assetId: string) => {
  return new listAssetPropertiesWithComposite({ assetId, client }).send();
};

const listPropertiesSiteWiseAssetQuery = async (
  client: IoTSiteWiseClient,
  siteWiseQuery: Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
) =>
  Promise.all(
    siteWiseQuery.assets?.map(({ assetId }: { assetId: string }) =>
      listAssetProperties(client, assetId)
    ) ?? []
  );

const newMapPropertySummary = ({
  id,
  unit,
  alias,
  path,
  dataType,
}: AssetModelPropertySummary & AssetPropertySummary): PropertySummary => ({
  propertyId: id,
  name: path?.[path.length - 1].name,
  unit,
  dataType,
  alias,
});

const mapListAssetPropertiesToAssetSummary = (
  n: (AssetModelPropertySummary & AssetPropertySummary)[],
  assetId: string,
  assetName: string | undefined
): AssetSummary => {
  return {
    assetId: assetId,
    assetName: assetName,
    properties: n.map(newMapPropertySummary) ?? [],
    alarms: [],
  };
};

export const useListAssetPropertiesMapQuery = (
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
) => {
  const { iotSiteWiseClient } = useClients();
  const fetchSiteWiseAssetQueryDescription = async () => {
    if (!iotSiteWiseClient || !siteWiseQuery) return [];
    return listPropertiesSiteWiseAssetQuery(iotSiteWiseClient, siteWiseQuery);
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
        const assetId = n.at(0)?.path?.at(0)?.id;
        if (assetId) {
          const assetName = n.at(0)?.path?.at(0)?.name;
          acc[assetId] = mapListAssetPropertiesToAssetSummary(
            n,
            assetId,
            assetName
          );
        }
        return acc;
      }, {}) ?? {},
  });
};

//dead code?? Please let me know if we should remove in PR review

export const useAssetDescriptionQuery = (assetId: string | undefined) => {
  const { iotSiteWiseClient } = useClients();

  const fetchAssetDescription = async () => {
    if (!iotSiteWiseClient || !assetId) return;

    return describeAsset(iotSiteWiseClient, assetId);
  };

  return useQuery({
    queryKey: [...ASSET_DESCRIPTION_QUERY_KEY, assetId],
    queryFn: () => fetchAssetDescription(),
    select: (data) => (data ? mapAssetDescriptionToAssetSummary(data) : data),
    enabled: !!assetId,
  });
};
