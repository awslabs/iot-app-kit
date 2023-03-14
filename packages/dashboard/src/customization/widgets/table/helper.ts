import { toId } from '@iot-app-kit/source-iotsitewise';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import type { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import type { TableColumnDefinition, TableItem } from '@iot-app-kit/react-components';

export const getTableDefinitions: (
  siteWiseAssetQuery: SiteWiseAssetQuery,
  descriptionMap: Record<string, DescribeAssetResponse>
) => { items: TableItem[]; columnDefinitions: TableColumnDefinition[] } = (siteWiseAssetQuery, descriptionMap) => {
  const propertyNames: string[] = [];
  const items = siteWiseAssetQuery.assets.map(({ assetId, properties }) => {
    const item: TableItem = {};
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
  const columnDefinitions: TableColumnDefinition[] = propertyNames.map((name) => ({ key: name, header: name }));
  return {
    items,
    columnDefinitions,
  };
};
