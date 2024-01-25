import { StyledAssetQuery } from '~/customization/widgets/types';
import { useListAssetPropertiesMapQuery } from '~/hooks/useAssetDescriptionQueries';
import { useAssetModel } from '~/hooks/useAssetModel/useAssetModel';
import { convertPropertiesToMap } from '~/components/playground/propertiesTable/propertiesTable';
import { useClients } from '~/components/dashboard/clientContext';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export const useWidgetMetaData = (widgetQuery?: StyledAssetQuery) => {
  const { iotSiteWiseClient } = useClients();
  const describedAssetsMapQuery = useListAssetPropertiesMapQuery(widgetQuery);

  const describedAssetsMap = convertPropertiesToMap(
    describedAssetsMapQuery.data ?? {}
  );

  // read modeled data --> query.assets
  const modeledItems = describedAssetsMap
    ? widgetQuery?.assets?.flatMap(({ assetId, properties }) => {
        return properties.map((p, index) => {
          return {
            key: `${assetId}-${p.propertyId}`,
            ...p,
            index,
            ...describedAssetsMap[assetId].properties[p.propertyId],
            assetId,
            assetName: describedAssetsMap[assetId].assetName,
            type: 'modeled',
          };
        });
      }) ?? []
    : [];

  // read unmodeled data --> query.properties
  const unmodeledItems =
    widgetQuery?.properties?.map((p) => {
      return { ...p, key: p.refId, name: p.propertyAlias, type: 'unmodeled' };
    }) ?? [];

  // read asset modeled data --> query.assetModel
  const assetModelIds = (widgetQuery?.assetModels ?? []).map(
    ({ assetModelId }) => assetModelId
  );
  const { assetModels } = useAssetModel({
    assetModelIds,
    client: iotSiteWiseClient ?? ({} as IoTSiteWiseClient),
  });
  const assetModeled =
    widgetQuery?.assetModels?.flatMap(
      ({ assetModelId, properties }) =>
        properties.map((property) => {
          const assetModel = assetModels?.at(0); //we dont support multiselect right now, so this will always be correct
          if (!assetModel) return null;

          return {
            ...property,
            assetId: assetModelId,
            assetName: assetModel.at(0)?.path?.[0].name,
            ...(assetModel.find((a) => a.id === property.propertyId) ?? {}),
            alarms: [],
            key: `${assetModelId}-${property.propertyId}`,
          };
        }) ?? []
    ) ?? [];

  return [
    ...modeledItems,
    ...unmodeledItems,
    ...assetModeled.filter((ele) => !!ele),
  ];
};
