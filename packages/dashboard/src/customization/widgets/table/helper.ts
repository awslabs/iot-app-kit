import { SiteWiseAssetQuery, toId } from '@iot-app-kit/source-iotsitewise';
import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import { ColumnDefinition, Item } from '@iot-app-kit/table';

export const getTableDefinitions: (
  siteWiseAssetQuery: SiteWiseAssetQuery,
  descriptionMap: Record<string, DescribeAssetResponse>
) => { items: Item[]; columnDefinitions: ColumnDefinition[] } = (siteWiseAssetQuery, descriptionMap) => {
  const propertyNames: string[] = [];
  const items = siteWiseAssetQuery.assets.map(({ assetId, properties }) => {
    const item: Item = {};
    properties.forEach(({ propertyId }) => {
      const name = descriptionMap[assetId]?.assetProperties?.find((p) => p.id === propertyId)?.name || propertyId;
      item[name] = {
        $cellRef: {
          id: toId({ assetId, propertyId }),
          resolution: 0,
        },
      };
      if (!propertyNames.includes(name)) {
        propertyNames.push(name);
      }
    });
    return item;
  });
  const columnDefinitions: ColumnDefinition[] = propertyNames.map((name) => ({ key: name, header: name }));
  return {
    items,
    columnDefinitions,
  };
};
