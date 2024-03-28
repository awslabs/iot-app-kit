import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import type { ResourceSchema } from '../resource-table/types';

export function createAssetExplorerSchema({
  renderName,
}: {
  renderName: (resource: AssetSummary) => string | React.ReactNode;
}): ResourceSchema<AssetSummary> {
  const schema: ResourceSchema<AssetSummary> = {
    name: 'Asset',
    pluralName: 'Assets',
    properties: [
      {
        id: 'arn',
        name: 'ARN',
        pluralName: 'ARNs',
        render: (resource) => resource.arn,
        filterOperators: ['=', '!=', ':', '!:'],
      },
      {
        id: 'id',
        name: 'ID',
        pluralName: 'IDs',
        render: (resource) => resource.id,
        filterOperators: ['=', '!=', ':', '!:'],
      },
      {
        id: 'description',
        name: 'Description',
        pluralName: 'Descriptions',
        render: (resource) => resource.description,
        filterOperators: ['=', '!=', ':', '!:'],
      },
      {
        id: 'name',
        name: 'Name',
        pluralName: 'Names',
        render: renderName,
        filterOperators: ['=', '!=', ':', '!:'],
      },
    ],
  };

  return schema;
}
